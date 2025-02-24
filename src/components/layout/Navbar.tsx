import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/benchmarks', label: 'Benchmarks' },
  { href: '/download', label: 'Download' },
  { href: '/purchase', label: 'Purchase' },
  { href: '/support', label: 'Support' }
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-2"
            >
              <img src="/favicon.svg" alt="Click Nova" className="w-8 h-8" />
            </Link>
            
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    location.pathname === link.href || 
                    (link.href !== '/' && location.pathname.startsWith(link.href))
                      ? 'text-cyan-400'
                      : 'text-white hover:text-cyan-400'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
