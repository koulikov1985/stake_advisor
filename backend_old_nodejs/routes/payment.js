const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const pool = require('../db/pool');
const { checkoutLimiter } = require('../middleware/rateLimit');
const { recordReferralCommission, linkReferral } = require('./affiliate');

// Plan configurations
const PLANS = {
  daily: {
    priceId: process.env.STRIPE_PRICE_DAILY,
    duration: 1, // days
    name: '1-Day Pass',
    price: 5
  },
  weekly: {
    priceId: process.env.STRIPE_PRICE_WEEKLY,
    duration: 7,
    name: 'Weekly Access',
    price: 25
  },
  monthly: {
    priceId: process.env.STRIPE_PRICE_MONTHLY,
    duration: 30,
    name: 'Monthly',
    price: 75
  },
  yearly: {
    priceId: process.env.STRIPE_PRICE_YEARLY,
    duration: 365,
    name: 'Yearly',
    price: 699
  }
};

// Create Stripe Checkout Session
router.post('/create-checkout-session', checkoutLimiter, async (req, res) => {
  try {
    const { plan, email, referralCode } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const planConfig = PLANS[plan];

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/?canceled=true`,
      subscription_data: {
        metadata: {
          plan: plan,
          duration_days: planConfig.duration
        }
      },
      metadata: {
        plan: plan,
        referral_code: referralCode || ''
      }
    };

    // Pre-fill email if provided
    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe Webhook Handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Handle successful checkout
async function handleCheckoutComplete(session) {
  try {
    const email = session.customer_email || session.customer_details?.email;
    const customerId = session.customer;
    const newSubscriptionId = session.subscription;
    const referralCode = session.metadata?.referral_code;

    if (!email) {
      console.error('Missing email in session:', session.id);
      return;
    }

    // For subscriptions, get metadata from the subscription object
    let plan = null;
    let durationDays = 30;

    if (newSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(newSubscriptionId);
      plan = subscription.metadata?.plan;
      durationDays = parseInt(subscription.metadata?.duration_days) || 30;

      // If no metadata, try to determine plan from price
      if (!plan && subscription.items?.data?.[0]?.price?.id) {
        const priceId = subscription.items.data[0].price.id;
        for (const [planName, config] of Object.entries(PLANS)) {
          if (config.priceId === priceId) {
            plan = planName;
            durationDays = config.duration;
            break;
          }
        }
      }
    }

    // Fallback to session metadata
    if (!plan) {
      plan = session.metadata?.plan;
      durationDays = parseInt(session.metadata?.duration_days) || 30;
    }

    if (!plan) {
      console.error('Could not determine plan for session:', session.id);
      plan = 'monthly'; // Default fallback
      durationDays = 30;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Get payment amount for commission calculation
    const paymentAmount = PLANS[plan]?.price || 0;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    let userId;

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      userId = user.id;

      // Cancel old subscription if exists and different from new one
      if (user.stripe_subscription_id && user.stripe_subscription_id !== newSubscriptionId) {
        try {
          await stripe.subscriptions.cancel(user.stripe_subscription_id);
          console.log(`Cancelled old subscription ${user.stripe_subscription_id} for ${email}`);
        } catch (cancelErr) {
          console.error('Failed to cancel old subscription:', cancelErr.message);
        }
      }

      // Generate license key if not exists
      const licenseKey = user.license_key || crypto.randomUUID();

      // Set new expiry based on new plan (don't stack, replace)
      await pool.query(
        `UPDATE users
         SET expires_at = $1, plan = $2, active = true,
             stripe_customer_id = COALESCE($3, stripe_customer_id),
             stripe_session_id = $4,
             stripe_subscription_id = $5,
             license_key = COALESCE(license_key, $6)
         WHERE email = $7`,
        [expiresAt, plan, customerId, session.id, newSubscriptionId, licenseKey, email.toLowerCase()]
      );
      console.log(`Updated license for ${email} with ${plan} plan until ${expiresAt}`);

      // Link referral if this is a new referred user (only on first purchase)
      if (!user.referred_by && referralCode) {
        await linkReferral(email, referralCode);
      }
    } else {
      // Create new license with generated key
      const licenseKey = crypto.randomUUID();
      const result = await pool.query(
        `INSERT INTO users (email, license_key, plan, expires_at, active, stripe_customer_id, stripe_session_id, stripe_subscription_id)
         VALUES ($1, $2, $3, $4, true, $5, $6, $7)
         RETURNING id`,
        [email.toLowerCase(), licenseKey, plan, expiresAt, customerId, session.id, newSubscriptionId]
      );
      userId = result.rows[0].id;
      console.log(`Created new license for ${email} until ${expiresAt}`);

      // Link referral for new user
      if (referralCode) {
        await linkReferral(email, referralCode);
      }
    }

    // Record referral commission (15% recurring)
    if (userId && paymentAmount > 0) {
      await recordReferralCommission(userId, paymentAmount, session.id);
    }
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

// Get session details (for success page)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    const email = session.customer_email || session.customer_details?.email;

    // Get license from database
    const result = await pool.query(
      'SELECT license_key, plan, expires_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // License might not be created yet (webhook delay)
      return res.status(202).json({
        message: 'License is being processed, please wait a moment',
        email
      });
    }

    const user = result.rows[0];
    res.json({
      email,
      licenseKey: user.license_key,
      plan: user.plan,
      expiresAt: user.expires_at
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

// Create Stripe Customer Portal session for managing subscriptions
router.post('/create-portal-session', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get user's Stripe customer ID
    const result = await pool.query(
      'SELECT stripe_customer_id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0 || !result.rows[0].stripe_customer_id) {
      return res.status(404).json({ error: 'No subscription found for this email' });
    }

    const customerId = result.rows[0].stripe_customer_id;

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

module.exports = router;
