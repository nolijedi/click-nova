import { Navbar } from './Navbar';
import { BackgroundVideo } from './BackgroundVideo';
import { PageTransition } from './PageTransition';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <BackgroundVideo />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  );
}
