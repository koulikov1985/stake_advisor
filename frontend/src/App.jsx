import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Download from './pages/Download';
import Success from './pages/Success';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Affiliate from './pages/Affiliate';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Features from './pages/Features';
import GTOSolver from './pages/GTOSolver';
import HandAnalyzer from './pages/HandAnalyzer';
import HowItWorks from './pages/HowItWorks';
import Blog from './pages/Blog';
import BlogWhatIsGTO from './pages/BlogWhatIsGTO';
import BlogBestPokerSoftware from './pages/BlogBestPokerSoftware';
import BlogPokerHUDStats from './pages/BlogPokerHUDStats';
import BlogHandAnalysis from './pages/BlogHandAnalysis';
import BlogHowPokerAIWorks from './pages/BlogHowPokerAIWorks';
import PokerTrainingSoftware from './pages/PokerTrainingSoftware';
import BestPokerHUD from './pages/BestPokerHUD';
import PokerBotAlternative from './pages/PokerBotAlternative';
import PokerEquityCalculator from './pages/PokerEquityCalculator';
import PokerRangeAnalyzer from './pages/PokerRangeAnalyzer';

function AppContent() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/download" element={<Download />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* SEO Landing Pages */}
        <Route path="/gto-solver" element={<GTOSolver />} />
        <Route path="/hand-analyzer" element={<HandAnalyzer />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/poker-training-software" element={<PokerTrainingSoftware />} />
        <Route path="/best-poker-hud" element={<BestPokerHUD />} />
        <Route path="/poker-bot-alternative" element={<PokerBotAlternative />} />
        <Route path="/poker-equity-calculator" element={<PokerEquityCalculator />} />
        <Route path="/poker-range-analyzer" element={<PokerRangeAnalyzer />} />

        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/what-is-gto-poker" element={<BlogWhatIsGTO />} />
        <Route path="/blog/best-poker-software-2026" element={<BlogBestPokerSoftware />} />
        <Route path="/blog/poker-hud-statistics-guide" element={<BlogPokerHUDStats />} />
        <Route path="/blog/poker-hand-analysis-guide" element={<BlogHandAnalysis />} />
        <Route path="/blog/how-poker-ai-works" element={<BlogHowPokerAIWorks />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
