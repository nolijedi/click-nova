import { useEffect, useRef, useState } from 'react';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video loading error:', e);
    setVideoError(true);
  };

  if (videoError) {
    return (
      <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-10" />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onError={handleVideoError}
        className="absolute top-1/2 left-1/2 min-h-[100%] min-w-[100%] -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
