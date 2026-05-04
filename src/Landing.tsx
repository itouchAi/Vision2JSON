import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const FadingVideo = ({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fadingOutRef = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOutRef.current = false;
        fadeTo(1, 500);
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
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={style}
      autoPlay
      muted
      playsInline
      preload="auto"
    />
  );
};

const BlurText = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(' ');

  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '0.1em' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { filter: 'blur(10px)', opacity: 0, y: 50 },
            visible: {
              filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
              opacity: [0, 0.5, 1],
              y: [50, -5, 0],
              transition: {
                duration: 0.7,
                times: [0, 0.5, 1],
                ease: 'easeOut',
                delay: (i * 100) / 1000
              }
            }
          }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default function Landing() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      className="text-white min-h-screen font-body overflow-x-hidden w-full z-0 bg-transparent"
    >
      {/* Section 1 - Hero */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col pt-4 px-4 bg-transparent">
        <motion.div 
          initial={{ filter: 'blur(35px) brightness(0.5)' }}
          animate={{ filter: 'blur(0px) brightness(1)' }}
          exit={{ filter: 'blur(35px) brightness(0.5)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <FadingVideo
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
            className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
            style={{ width: '120%', height: '120%' }}
          />
        </motion.div>
        
        {/* Navbar */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-4 left-0 right-0 px-8 lg:px-16 z-50 flex items-center justify-between"
        >
          <div className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center">
            <span className="font-heading italic lowercase text-2xl relative top-0.5">a</span>
          </div>
          
          <div className="hidden lg:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
            {['Home', 'Voyages', 'Worlds', 'Innovation'].map((item) => (
              <a key={item} href="#" className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors">
                {item}
              </a>
            ))}
            <Link to="/studio" className="px-3 py-2 text-sm font-medium bg-white text-black rounded-full whitespace-nowrap flex items-center gap-1 ml-2 font-body hover:bg-gray-100 transition-colors">
              Plan Launch
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>
          
          <div className="w-12 h-12 invisible" />
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center pt-16">
          <motion.div 
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', transition: { duration: 0.5, ease: "easeIn" } }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="liquid-glass rounded-full px-3.5 py-1.5 flex items-center gap-3 mb-6"
            >
              <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full">New</span>
              <span className="text-sm text-white/90 pr-3 font-body font-medium">Maiden Crewed Voyage to Mars Arrives 2026</span>
            </motion.div>

            <BlurText 
              text="Venture Past Our Sky Across the Universe" 
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl tracking-[-4px]"
            />

            <motion.p
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
              className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight px-4"
            >
              Discover the universe in ways once unimaginable. Our pioneering vessels and breakthrough engineering bring deep-space exploration within reach—secure and extraordinary.
            </motion.p>

            <motion.div
              initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
              className="flex items-center gap-6 mt-6"
            >
              <Link to="/studio" className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium text-white flex items-center gap-2 hover:bg-white/10 transition-colors">
                Start Your Voyage
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                </svg>
              </Link>
              <button className="flex items-center gap-2 text-sm text-white/90 font-medium hover:text-white transition-colors group px-3 py-2">
                View Liftoff
                <svg className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150, filter: 'blur(10px)', transition: { duration: 0.6, ease: "easeIn" } }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1.3 }}
            className="flex flex-wrap justify-center items-stretch gap-4 mt-8 px-4"
          >
            <div className="liquid-glass rounded-[1.25rem] p-5 w-[220px] text-left flex flex-col justify-between border-0">
              <svg className="w-7 h-7 mb-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <div>
                <div className="font-heading italic text-white text-4xl tracking-[-1px] leading-none mb-2">34.5 Min</div>
                <div className="text-xs text-white font-body font-light">Average Videos Watch Time</div>
              </div>
            </div>
            <div className="liquid-glass rounded-[1.25rem] p-5 w-[220px] text-left flex flex-col justify-between border-0">
              <svg className="w-7 h-7 mb-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
              </svg>
              <div>
                <div className="font-heading italic text-white text-4xl tracking-[-1px] leading-none mb-2">2.8B+</div>
                <div className="text-xs text-white font-body font-light">Users Across the Globe</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partners */}
        <motion.div
          exit={{ opacity: 0, y: 20, transition: { duration: 0.4 } }}
          initial={{ opacity: 0, filter: 'blur(5px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="relative z-10 flex flex-col items-center gap-4 pb-8 mt-auto"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-[11px] font-medium text-white/90 font-body">
            Collaborating with top aerospace pioneers globally
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 font-heading italic text-white text-2xl md:text-3xl tracking-tight opacity-90">
            <span>Aeon</span>
            <span className="text-sm opacity-50">·</span>
            <span>Vela</span>
            <span className="text-sm opacity-50">·</span>
            <span>Apex</span>
            <span className="text-sm opacity-50">·</span>
            <span>Orbit</span>
            <span className="text-sm opacity-50">·</span>
            <span>Zeno</span>
          </div>
        </motion.div>
      </section>

      {/* Section 2 - Capabilities */}
      <section className="relative min-h-screen w-full flex flex-col pt-24 pb-10 px-8 md:px-16 lg:px-20 bg-black">
        <FadingVideo
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        <div className="relative z-10 flex flex-col h-full bg-transparent flex-1">
          <p className="text-[13px] font-body text-white/80 mb-6 uppercase tracking-wider font-medium">// Capabilities</p>
          <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
            Production<br/>evolved
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pb-8 h-full">
            {/* Card 1 */}
            <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center shrink-0 border-0">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z" />
                  </svg>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {['Natural Context', 'Photo Realism', 'Infinite Settings', 'Eco-Vibe'].map((tag) => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap border-0">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-8">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">AI Scenery</h3>
                <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  AI analyzes your product to create indistinguishable natural environments — from Icelandic cliffs to misty forests.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center shrink-0 border-0">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z" />
                  </svg>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {['Scale Fast', 'Visual Consistency', 'Time Saver', 'Ready to Post'].map((tag) => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap border-0">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-8">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Batch Production</h3>
                <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  Style your entire product line in minutes. Create a unified visual identity for catalogues and social media without weeks of retouching.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="w-11 h-11 liquid-glass rounded-[0.75rem] flex items-center justify-center shrink-0 border-0">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z" />
                  </svg>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {['Ray Tracing', 'Physical Shadows', 'Studio Quality', 'Sunlight Sync'].map((tag) => (
                    <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap border-0">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-1" />
              <div className="mt-8">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">Smart Lighting</h3>
                <p className="text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  Automatic lighting and material adjustment. Achieve flawless integration with realistic shadows and sunlight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
