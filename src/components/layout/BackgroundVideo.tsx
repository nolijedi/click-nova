import { useEffect, useRef } from 'react';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute h-full w-full object-cover opacity-20"
        poster="/click-nova/placeholder.svg"
        onError={(e) => {
          console.error('Video loading error:', e);
        }}
      >
        <source src="/click-nova/cyberpunk-city.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
    </div>
  );
}
