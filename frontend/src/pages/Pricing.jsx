import React from 'react';
import PricingCard from '../components/PricingCard';

const plans = [
  {
    plan: 'daily',
    name: '1-Day Pass',
    price: '5',
    duration: 'day',
    features: [
      'Full real-time advisor',
      'All stakes supported',
      'Unlimited sessions',
      'Email support'
    ],
    popular: false
  },
  {
    plan: 'weekly',
    name: 'Weekly',
    price: '25',
    duration: 'week',
    features: [
      'Full real-time advisor',
      'All stakes supported',
      'Unlimited sessions',
      'Priority support',
      'Save 29%'
    ],
    popular: false
  },
  {
    plan: 'monthly',
    name: 'Monthly',
    price: '75',
    duration: 'month',
    features: [
      'Full real-time advisor',
      'All stakes supported',
      'Unlimited sessions',
      'Priority support',
      'Save 50%'
    ],
    popular: true
  },
  {
    plan: 'yearly',
    name: 'Yearly',
    price: '699',
    duration: 'year',
    features: [
      'Full real-time advisor',
      'All stakes supported',
      'Unlimited sessions',
      'Priority support',
      'Best value - Save 62%'
    ],
    popular: false
  }
];

function Pricing() {
  return (
    <div className="home">
      <section className="pricing" id="pricing" style={{ paddingTop: '120px' }}>
        <h2>Choose Your Plan</h2>
        <p className="section-subtitle">No commitments. Cancel anytime. Instant license key delivery.</p>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.plan} {...plan} />
          ))}
        </div>

        <div className="pricing-guarantee" style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(34, 197, 94, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>🔒 Secure Payment</h3>
          <p style={{ color: '#a1a1aa' }}>All transactions are encrypted and processed securely via Stripe</p>
        </div>
      </section>
    </div>
  );
}

export default Pricing;
