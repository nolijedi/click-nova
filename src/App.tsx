import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Features from '@/pages/Features';
import Optimization from '@/pages/Optimization';
import Monitoring from '@/pages/Monitoring';
import Reviews from '@/pages/Reviews';
import { GameProvider } from '@/contexts/GameContext';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <GameProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Features />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/optimization" element={<Optimization />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/reviews" element={<Reviews />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
            <Toaster />
          </GameProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
