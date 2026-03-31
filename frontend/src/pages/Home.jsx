import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PricingCard from '../components/PricingCard';

const plans = [
  {
    plan: 'daily',
    name: 'Daily',
    price: '4.99',
    duration: 'day',
    features: [
      'Full access for 24 hours',
      'All features included',
      'Instant activation',
      'Email support'
    ],
    popular: false
  },
  {
    plan: 'weekly',
    name: 'Weekly',
    price: '19.99',
    duration: 'week',
    features: [
      'Full access for 7 days',
      'All features included',
      'Instant activation',
      'Priority email support',
      'Save 43% vs daily'
    ],
    popular: true
  },
  {
    plan: 'monthly',
    name: 'Monthly',
    price: '79.99',
    duration: 'month',
    features: [
      'Full access for 30 days',
      'All features included',
      'Instant activation',
      'Priority support',
      'Save 47% vs daily'
    ],
    popular: false
  }
];

function Home() {
  const [searchParams] = useSearchParams();
  const [showCanceled, setShowCanceled] = useState(false);

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true);
      // Remove the query parameter from URL
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  return (
    <div className="home">
      {showCanceled && (
        <div className="canceled-banner">
          <p>Payment was canceled. Feel free to try again when you're ready.</p>
          <button onClick={() => setShowCanceled(false)}>×</button>
        </div>
      )}

      <section className="hero">
        <h1>Get Your License Key</h1>
        <p>Choose the plan that works best for you. Instant delivery after payment.</p>
      </section>

      <section className="pricing">
        <div className="pricing-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.plan} {...plan} />
          ))}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Instant Delivery</h3>
            <p>Get your license key immediately after payment</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Payment</h3>
            <p>Powered by Stripe for maximum security</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💬</span>
            <h3>24/7 Support</h3>
            <p>Our team is here to help you anytime</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔄</span>
            <h3>Easy Renewal</h3>
            <p>Simply purchase again to extend your license</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
