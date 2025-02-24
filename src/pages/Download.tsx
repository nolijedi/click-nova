import { Button } from '@/components/ui/button';
import { Download as DownloadIcon, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function Download() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (downloading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            setComplete(true);
            setDownloading(false);
          }
          return next;
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [downloading, progress]);

  const handleDownload = () => {
    setDownloading(true);
    setProgress(0);
    setComplete(false);
    
    // In production, this would be a real file download
    setTimeout(() => {
      const filename = 'ClickNovaOptimizer.exe';
      const blob = new Blob(['placeholder'], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 2000); // Wait for progress animation
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[80vh] text-center relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-blue-500/10 rounded-3xl backdrop-blur-sm" />
      <div className="relative z-10 space-y-8 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Download Click Nova
          </h1>
          <p className="text-xl text-white/70">
            Experience the power of Click Nova with our free version.
          </p>
        </motion.div>

        {!downloading && !complete ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={handleDownload}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-6 text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <DownloadIcon className="w-5 h-5" />
                  Download Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/60">
              <Sparkles className="w-4 h-4" />
              <span>Free Version Available</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 w-full max-w-md mx-auto"
          >
            <Progress value={progress} className="h-2 bg-white/10" />
            <p className="text-white/70">
              {complete ? 'Download Complete!' : `Downloading... ${Math.round(progress)}%`}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
