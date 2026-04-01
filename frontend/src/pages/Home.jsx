import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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

const features = [
  {
    icon: '🎯',
    title: 'Real-Time Analysis',
    description: 'Get instant recommendations as you play. Our advisor analyzes every hand in real-time.'
  },
  {
    icon: '💰',
    title: 'Cash Game Optimized',
    description: 'Built specifically for cash games. Maximize your win rate at any stake level.'
  },
  {
    icon: '🧠',
    title: 'GTO-Based Strategy',
    description: 'Decisions powered by game theory optimal strategies used by professional players.'
  },
  {
    icon: '🌐',
    title: 'Browser-Based',
    description: 'Works directly in your browser. No downloads, no installations, instant access.'
  },
  {
    icon: '📊',
    title: 'Hand Range Analysis',
    description: 'See opponent ranges and equity calculations for every decision point.'
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Sub-second recommendations so you never miss a beat at the tables.'
  }
];

const howItWorks = [
  {
    step: '1',
    title: 'Get Your License',
    description: 'Choose a plan and get your license key instantly after payment.'
  },
  {
    step: '2',
    title: 'Activate Advisor',
    description: 'Enter your license key in the browser extension to activate.'
  },
  {
    step: '3',
    title: 'Play & Win',
    description: 'Start playing and receive real-time advice on every hand.'
  }
];

const faqs = [
  {
    question: 'Which poker sites are supported?',
    answer: 'Stake Advisor works with all major online poker rooms that run in your browser.'
  },
  {
    question: 'Will this get me banned?',
    answer: 'Stake Advisor runs locally in your browser and does not interact with poker site software. However, always check the terms of service of your poker room.'
  },
  {
    question: 'What stakes does it support?',
    answer: 'All stakes from micro to high stakes. The advisor adapts its recommendations based on the game dynamics.'
  },
  {
    question: 'How do I get my license key?',
    answer: 'After payment, your license key is displayed immediately and sent to your email.'
  },
  {
    question: 'Can I use it on multiple devices?',
    answer: 'Your license key works on any device, but only one active session at a time.'
  }
];

function Home() {
  const [searchParams] = useSearchParams();
  const [showCanceled, setShowCanceled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      setShowCanceled(true);
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">Real-Time Poker Assistant</div>
        <h1>Dominate Cash Games with <span className="highlight">Stake Advisor</span></h1>
        <p className="hero-subtitle">
          Professional-grade poker advisor that analyzes every hand in real-time.
          Make optimal decisions, increase your win rate, and crush the tables.
        </p>
        <div className="hero-cta">
          <a href="#pricing" className="btn btn-primary btn-large">Get Started</a>
          <a href="#how-it-works" className="btn btn-secondary btn-large">How It Works</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Why Players Choose Stake Advisor</h2>
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

      {/* How It Works Section */}
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

      {/* Pricing Section */}
      <section className="pricing" id="pricing">
        <h2>Choose Your Plan</h2>
        <p className="section-subtitle">No commitments. Cancel anytime.</p>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.plan} {...plan} />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${openFaq === index ? 'open' : ''}`}
              key={index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle">{openFaq === index ? '−' : '+'}</span>
              </div>
              {openFaq === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Ready to Improve Your Game?</h2>
        <p>Start using Stake Advisor today and take your poker game to the next level.</p>
        <a href="#pricing" className="btn btn-primary btn-large">Get Started Now</a>
      </section>
    </div>
  );
}

export default Home;
