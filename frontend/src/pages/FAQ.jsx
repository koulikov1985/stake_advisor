import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'Which poker sites are supported?',
    answer: 'SharkScope Pro works with all major online poker rooms that run in your browser.'
  },
  {
    question: 'Will this get me banned?',
    answer: 'SharkScope Pro runs locally in your browser and does not interact with poker site software. However, always check the terms of service of your poker room.'
  },
  {
    question: 'What stakes does it support?',
    answer: 'All stakes from micro to high stakes. The advisor adapts its recommendations based on the game dynamics.'
  },
  {
    question: 'How do I get my license key?',
    answer: 'After payment, your license key is displayed immediately and sent to your email. You can also find it in your dashboard.'
  },
  {
    question: 'Can I use it on multiple devices?',
    answer: 'Your license key works on any device, but only one active session at a time.'
  },
  {
    question: 'How does the real-time analysis work?',
    answer: 'Our browser extension reads the poker table display and uses advanced algorithms to analyze hand ranges, pot odds, and optimal plays in real-time.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and popular payment methods through our secure Stripe payment processor.'
  },
  {
    question: 'Can I upgrade my plan?',
    answer: 'Yes, you can upgrade your plan at any time from your dashboard. The remaining time from your current plan will be applied.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'We offer a 1-day pass for just $5 so you can try out all features before committing to a longer plan.'
  },
  {
    question: 'How do I contact support?',
    answer: 'You can reach our support team through the dashboard or by emailing support@sharkscopepro.com. Priority support is included with Weekly, Monthly, and Yearly plans.'
  }
];

function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="home">
      <section className="faq" id="faq" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <h2>Frequently Asked Questions</h2>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Everything you need to know about SharkScope Pro</p>
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

      <section className="final-cta">
        <h2>Still Have Questions?</h2>
        <p>Contact our support team or get started with a 1-day pass.</p>
        <Link to="/pricing" className="btn btn-primary btn-large">View Pricing</Link>
      </section>
    </div>
  );
}

export default FAQ;
