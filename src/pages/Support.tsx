import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, FileText, Github } from 'lucide-react';

const supportLinks = [
  {
    icon: MessageSquare,
    title: 'Community Forum',
    description: 'Connect with other users and share experiences',
    href: '#',
    variant: 'outline' as const
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help from our support team',
    href: 'mailto:support@clicknova.com',
    variant: 'outline' as const
  },
  {
    icon: FileText,
    title: 'Documentation',
    description: 'Read our detailed guides and tutorials',
    href: '#',
    variant: 'outline' as const
  },
  {
    icon: Github,
    title: 'GitHub Issues',
    description: 'Report bugs or request features',
    href: 'https://github.com/nolijedi/click-nova/issues',
    variant: 'outline' as const
  }
];

export default function Support() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Support
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="block"
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <Button
              variant={link.variant}
              className="w-full h-auto p-6 space-y-4 text-left bg-black/40 border-white/10 hover:border-cyan-500/50"
            >
              <link.icon className="h-6 w-6 text-cyan-400" />
              <div>
                <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
                <p className="text-sm text-white/70">{link.description}</p>
              </div>
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
}
