import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function PricingCard({ plan, name, price, duration, features, popular }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get referral code from localStorage if valid
      let referralCode = null;
      const storedCode = localStorage.getItem('referralCode');
      const expiresAt = localStorage.getItem('referralCodeExpires');
      if (storedCode && expiresAt && Date.now() < parseInt(expiresAt)) {
        referralCode = storedCode;
      }

      const response = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, referralCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={`pricing-card ${popular ? 'popular' : ''}`}>
      {popular && <div className="popular-badge">Most Popular</div>}
      <h3 className="plan-name">{name}</h3>
      <div className="plan-price">
        <span className="currency">$</span>
        <span className="amount">{price}</span>
        <span className="period">/{duration}</span>
      </div>
      <ul className="plan-features">
        {features.map((feature, index) => (
          <li key={index}>
            <span className="check">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {error && <p className="error-message">{error}</p>}
      <button
        className="purchase-btn"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Get Started'}
      </button>
    </div>
  );
}

export default PricingCard;
