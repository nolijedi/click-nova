import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/sonner';
import Features from '@/pages/Features';
import Benchmarks from '@/pages/Benchmarks';
import Download from '@/pages/Download';
import Purchase from '@/pages/Purchase';
import Support from '@/pages/Support';

// Simple NotFound component
function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        404 - Page Not Found
      </h1>
      <p className="text-white/70">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Features />} />
          <Route path="/features" element={<Features />} />
          <Route path="/benchmarks" element={<Benchmarks />} />
          <Route path="/download" element={<Download />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" />
    </Router>
  );
}
