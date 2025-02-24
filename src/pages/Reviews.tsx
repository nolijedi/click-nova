import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const reviews: Review[] = [
  {
    name: "Alex Thompson",
    role: "IT Professional",
    content: "Click Nova transformed my system's performance. The optimization tools are incredibly effective!",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "Software Developer",
    content: "Best system optimization tool I've used. The real-time monitoring is a game-changer.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Content Creator",
    content: "My workflow is so much smoother now. Click Nova helped me get the most out of my hardware.",
    rating: 5
  }
];

export default function Reviews() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        User Reviews
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-black/40 p-6 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex items-center gap-1 mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <blockquote className="text-white/90 mb-4">
              "{review.content}"
            </blockquote>
            
            <div className="mt-4">
              <div className="font-semibold text-white">{review.name}</div>
              <div className="text-sm text-white/70">{review.role}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
