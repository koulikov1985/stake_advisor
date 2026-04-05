import React from 'react';
import { useNavigate } from 'react-router-dom';

function PricingCard({ plan, name, price, label, duration, features, popular }) {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Already logged in, go to dashboard to purchase
      navigate('/dashboard');
    } else {
      // Not logged in, redirect to signup
      navigate('/signup');
    }
  };

  return (
    <div className={`pricing-card ${popular ? 'popular' : ''}`}>
      {popular && <div className="popular-badge">Most Popular</div>}
      <h3 className="plan-name">{name}</h3>
      <div className="plan-price">
        {plan === 'trial' ? (
          <>
            <span className="amount" style={{ fontSize: '1.5rem' }}>Try 200 hands free</span>
          </>
        ) : (
          <>
            <span className="currency">$</span>
            <span className="amount">{price}</span>
            <span className="period">/{duration}</span>
          </>
        )}
      </div>
      <ul className="plan-features">
        {features.map((feature, index) => (
          <li key={index}>
            <span className="check">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className="purchase-btn"
        onClick={plan === 'trial' ? () => window.open('https://discord.gg/NHUjvZXzrR', '_blank') : handlePurchase}
      >
        {plan === 'trial' ? 'Join Discord' : 'Get Started'}
      </button>
    </div>
  );
}

export default PricingCard;
