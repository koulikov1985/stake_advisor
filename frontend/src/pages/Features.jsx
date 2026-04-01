import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🎯',
    title: 'Real-Time Analysis',
    description: 'Get instant recommendations as you play. Our advisor analyzes every hand in real-time, helping you make the best decision in the moment.'
  },
  {
    icon: '💰',
    title: 'Cash Game Optimized',
    description: 'Built specifically for cash games. Maximize your win rate at any stake level from micro stakes to high roller tables.'
  },
  {
    icon: '🧠',
    title: 'GTO-Based Strategy',
    description: 'Decisions powered by game theory optimal strategies used by professional players. Play like the pros without years of study.'
  },
  {
    icon: '🌐',
    title: 'Browser-Based',
    description: 'Works directly in your browser. No downloads, no installations, instant access from any device with an internet connection.'
  },
  {
    icon: '📊',
    title: 'Hand Range Analysis',
    description: 'See opponent ranges and equity calculations for every decision point. Understand exactly where you stand in each hand.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Sub-second recommendations so you never miss a beat at the tables. Our optimized algorithms deliver advice instantly.'
  }
];

const howItWorks = [
  {
    step: '1',
    title: 'Get Your License',
    description: 'Choose a plan that fits your needs and get your license key instantly after payment.'
  },
  {
    step: '2',
    title: 'Activate Advisor',
    description: 'Enter your license key in the browser extension to activate your SharkScope Pro account.'
  },
  {
    step: '3',
    title: 'Play & Win',
    description: 'Start playing and receive real-time advice on every hand to maximize your profits.'
  }
];

function Features() {
  return (
    <div className="home">
      <section className="features" id="features" style={{ paddingTop: '120px' }}>
        <h2>Why Players Choose SharkScope Pro</h2>
        <p className="section-subtitle">Everything you need to make winning decisions at the poker table</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <h2>Start Winning in 3 Simple Steps</h2>
        <p className="section-subtitle">Get up and running in minutes</p>
        <div className="steps-grid">
          {howItWorks.map((item, index) => (
            <div className="step-card" key={index}>
              <div className="step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Ready to Play Like a Pro?</h2>
        <p>Start using SharkScope Pro today and dominate the tables.</p>
        <Link to="/pricing" className="btn btn-primary btn-large">View Pricing</Link>
      </section>
    </div>
  );
}

export default Features;
