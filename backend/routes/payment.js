const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db/pool');
const { checkoutLimiter } = require('../middleware/rateLimit');

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
    const { plan, email } = req.body;

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
    // For subscriptions, metadata is in subscription_data
    const metadata = session.metadata || {};
    const plan = metadata.plan || session.subscription_data?.metadata?.plan;
    const duration_days = metadata.duration_days || session.subscription_data?.metadata?.duration_days;
    const email = session.customer_email || session.customer_details?.email;
    const customerId = session.customer;

    if (!email || !plan) {
      console.error('Missing email or plan in session:', session.id);
      return;
    }

    const durationDays = parseInt(duration_days) || PLANS[plan]?.duration || 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Extend existing license
      const currentExpiry = new Date(existingUser.rows[0].expires_at);
      const newExpiry = currentExpiry > new Date()
        ? new Date(currentExpiry.getTime() + durationDays * 24 * 60 * 60 * 1000)
        : expiresAt;

      await pool.query(
        `UPDATE users
         SET expires_at = $1, plan = $2, active = true,
             stripe_customer_id = COALESCE($3, stripe_customer_id),
             stripe_session_id = $4
         WHERE email = $5`,
        [newExpiry, plan, customerId, session.id, email]
      );
      console.log(`Extended license for ${email} until ${newExpiry}`);
    } else {
      // Create new license
      await pool.query(
        `INSERT INTO users (email, plan, expires_at, stripe_customer_id, stripe_session_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [email, plan, expiresAt, customerId, session.id]
      );
      console.log(`Created new license for ${email} until ${expiresAt}`);
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

module.exports = router;
