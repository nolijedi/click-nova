import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    setIsFirstMount(false);
  }, []);

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        scale: isFirstMount ? 0.1 : 0.7,
        y: isFirstMount ? 500 : 100,
        rotateX: isFirstMount ? 45 : 20
      }}
      animate={{ 
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0
      }}
      exit={{ 
        opacity: 0,
        scale: 0.7,
        y: -100,
        rotateX: -20
      }}
      transition={{
        duration: isFirstMount ? 1.2 : 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ease curve for a cyberpunk feel
      }}
      style={{ 
        transformOrigin: 'bottom',
        perspective: 1000,
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
}
