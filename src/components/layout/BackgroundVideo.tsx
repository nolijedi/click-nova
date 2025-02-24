import { useEffect, useRef } from 'react';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slightly slow down the video for better ambiance
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] z-10" /> {/* Darker overlay with slight blur */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-h-[100%] min-w-[100%] -translate-x-1/2 -translate-y-1/2 object-cover scale-110" // Added scale-110 to ensure full coverage
      >
        <source src="/cyberpunk-city.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
