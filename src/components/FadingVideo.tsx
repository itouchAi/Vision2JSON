import React, { useEffect, useRef } from 'react';

export const FadingVideo = ({ src, srcs, className, style }: { src?: string; srcs?: string[]; className?: string; style?: React.CSSProperties }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rafId = useRef<number | null>(null);
  const [currentIdx, setCurrentIdx] = React.useState(0);

  const videoList = srcs || (src ? [src] : []);
  const currentSrc = videoList[currentIdx] || '';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentSrc) return;

    video.style.opacity = '0';

    const fadeTo = (targetOpacity: number, duration: number) => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      
      const startOpacity = parseFloat(video.style.opacity || '0');
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        video.style.opacity = (startOpacity + (targetOpacity - startOpacity) * progress).toString();

        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        }
      };

      rafId.current = requestAnimationFrame(animate);
    };

    const handleLoadedData = () => {
      video.style.opacity = '0';
      video.play().catch(() => {});
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      if (video.duration - video.currentTime <= 0.55 && video.duration > 0 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        if (videoList.length > 1) {
          fadingOutRef.current = false;
          setCurrentIdx((prevIdx) => (prevIdx + 1) % videoList.length);
        } else {
          video.currentTime = 0;
          video.play().catch(() => {});
          fadingOutRef.current = false;
          fadeTo(1, 500);
        }
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentSrc, videoList.length]);

  if (!currentSrc) return null;

  return (
    <video
      ref={videoRef}
      src={currentSrc}
      className={className}
      style={style}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
};
