/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import CircularGallery from './CircularGallery';

const translations = {
  en: {
    gallery: [
      { 
        image: `https://i.postimg.cc/wBTM2kjQ/img-1-(1).webp`, 
        text: 'The Octave Mosaic Table', 
        description: 'A masterfully crafted octagonal coffee table, blending warm natural timber segments with an intricate checkerboard woven core. Elevated by striking minimalist legs, it stands as a bold, artistic centerpiece for any refined living space.', 
        color: '#16131d' 
      },
      { 
        image: `https://i.postimg.cc/fbTyCvRq/img-1-(2).webp`, 
        text: 'The Ascent Nesting Stools', 
        description: 'Crafted from premium solid hardwood, this nesting trio merges architectural geometry with natural warmth. Perfectly stacked or styled individually, they offer versatile luxury for the modern home.', 
        color: '#0d131f', 
        bgImage: 'https://i.postimg.cc/Y0S4R3mm/Watermark-Free-Interior.png' 
      },
      { 
        image: `https://i.postimg.cc/d0t369Vf/img-1-(3).webp`, 
        text: 'The Solstice Nesting Trio', 
        description: 'Crafted from premium solid wood, this elegant trio of nesting tables merges organic warmth with functional sophistication. Featuring deep-toned circular tops set upon tapered natural legs, they offer versatile styling to elevate any luxury living space.', 
        color: '#100d1c', 
        bgImage: 'https://i.postimg.cc/x1dyJLSf/mixboard-image-(4).webp' 
      },
      { 
        image: `https://i.postimg.cc/0N2jnCyC/img-1-(4).webp`, 
        text: 'The Amber Accent Table', 
        description: 'Crafted from premium natural teak wood, this exquisite round accent table celebrates the warm, organic elegance of natural grain. Its minimalist three-legged silhouette brings a touch of mid-century warmth and timeless sophistication to any modern living space.', 
        color: '#0d0d12' 
      }
    ],
    title: "SIGNATURE COUTURE",
    subtitle: "እጅግ የረቀቁ ስራዎቻችን • The Masterpieces"
  },
  am: {
    gallery: [
      { 
        image: `https://i.postimg.cc/wBTM2kjQ/img-1-(1).webp`, 
        text: 'ድርና ማግ ጠረጴዛ', 
        description: 'በጥንቃቄ ከተሰሩ የስምንት ማዕዘን የእንጨት ቅርጾች እና ልዩ የሽመና (ድርና ማግ) ጥበብ ከተዋሃደ እምብርት የተሠራ ድንቅ የሳሎን ጠረጴዛ። በዘመናዊ ጥቁር እግሮች ላይ የቆመው ይህ የእጅ ጥበብ ውጤት ለቤትዎ ልዩ ግርማንና ውበትን ያጎናጽፋል።', 
        color: '#16131d',
        bgImage: 'https://i.postimg.cc/8zdRCZ6M/yg1.webp' 
      },
      { 
        image: `https://i.postimg.cc/fbTyCvRq/img-1-(2).webp`, 
        text: 'እርከነ-ውበት', 
        description: 'ከተመረጠ ጠንካራ እንጨት በጥበብ የተሰሩ፣ እነዚህ ተደራራቢ ወንበሮች የስነ-ህንፃ ጥበብን ከተፈጥሮ ውበት ጋር ያዋህዳሉ። በአንድ ላይ ተደርድረው ወይም ለየብቻቸው ተቀምጠው ለቤትዎ ልዩ ዘመናዊ ውበትን ያላብሳሉ።', 
        color: '#0d131f', 
        bgImage: 'https://i.postimg.cc/XYKfvsCG/yg2.webp' 
      },
      { 
        image: `https://i.postimg.cc/0N2jnCyC/img-1-(4).webp`, 
        text: 'ዋርካው ሦስትዮሽ', 
        description: 'ከከፍተኛ ጥራት ካለው ጠንካራ እንጨት በጥበብ የተሰሩ፣ እነዚህ ሶስት ተደራራቢ ጠረጴዛዎች ውበትንና ምቾትን አጣምረው የያዙ ናቸው። ውብ ጥቁር የእንጨት ገጻቸው እና ውብ የተፈጥሮ እግሮቻቸው ለማንኛውም ዘመናዊ ቤት አስደናቂ ድምቀትን ይሰጣሉ።', 
        color: '#100d1c', 
        bgImage: 'https://i.postimg.cc/yNHzm8xg/yg4.webp' 
      },
      { 
        image: `https://i.postimg.cc/d0t369Vf/img-1-(3).webp`, 
        text: 'ማዕደ ወርቅ', 
        description: 'ከተመረጠ ጠንካራ እንጨት በጥበብ የተሰራው ይህ ክብ ጠረጴዛ፣ የተፈጥሮን ውበትና ጥንካሬን ያጣመረ ነው። በሶስቱ እግሮቹ ላይ የቆመው ማራኪ ቅርፁ ለቤትዎ ልዩ ውበትና ዘመናዊ ድምቀት ያጎናጽፋል።', 
        color: '#0d0d12',
        bgImage: 'https://i.postimg.cc/FHbyKTLL/yg3.webp'
      }
    ],
    title: "የማስተርፒስ ስብስቦች",
    subtitle: "እጅግ የረቀቁ ስራዎቻችን • The Masterpieces"
  }
};

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const framesRef = useRef<ImageBitmap[]>([]);
  const src = "/andegna-hero.mp4";

  const lenisRef = useRef<Lenis | null>(null);

  // Circular Gallery states and refs
  const galleryLang = 'am';
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const galleryContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex === displayIndex) return;

    let isCancelled = false;

    const ctx = gsap.context(() => {
      gsap.to('.gallery-reveal-text', {
        y: '-100%',
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.in',
        onComplete: () => {
          if (!isCancelled) {
            setDisplayIndex(activeIndex);
          }
        }
      });
    }, galleryContainerRef);

    return () => {
      isCancelled = true;
      ctx.revert();
    };
  }, [activeIndex, displayIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gallery-reveal-text',
        { y: '100%' },
        { y: '0%', duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }, galleryContainerRef);
    return () => ctx.revert();
  }, [displayIndex]);

  // Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    if (!animationComplete) {
      lenis.stop();
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Sync scroll lock/unlock with animationComplete
  useEffect(() => {
    if (lenisRef.current) {
      if (animationComplete) {
        lenisRef.current.start();
      } else {
        lenisRef.current.stop();
      }
    }
  }, [animationComplete]);

  // Parallel Image Preloading for instant gallery rendering
  useEffect(() => {
    const imagesToPreload = [
      ...translations.am.gallery.map(item => item.image),
      ...translations.am.gallery.map(item => item.bgImage).filter(Boolean) as string[],
    ];

    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Pre-render logic (Video Frame Extraction)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let isCancelled = false;

    const initPreRender = async () => {
      try {
        if (video.readyState < 2) {
          await new Promise((resolve, reject) => {
            const handleLoaded = () => {
              cleanup();
              resolve(null);
            };
            const handleError = () => {
              cleanup();
              reject(new Error("Video failed to load"));
            };
            const cleanup = () => {
              video.removeEventListener('loadeddata', handleLoaded);
              video.removeEventListener('error', handleError);
            };
            video.addEventListener('loadeddata', handleLoaded);
            video.addEventListener('error', handleError);
            if (video.readyState >= 2) {
              cleanup();
              resolve(null);
            }
          });
        }

        if (!video.videoWidth || !video.videoHeight || isNaN(video.duration) || video.duration === 0) {
          throw new Error("Invalid video dimensions or duration");
        }

        // Speed Boost 1: Downscale extraction canvas if video is extremely high res
        let width = video.videoWidth;
        let height = video.videoHeight;
        const maxDimension = 1280; // Limit size to 1280px wide/high for blazing fast decoding
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        canvas.width = width;
        canvas.height = height;

        // Speed Boost 2: Dynamically scale FPS based on duration to cap total frames at around 40-50
        const duration = video.duration;
        let fps = 10;
        if (duration > 4) {
          fps = Math.max(5, Math.floor(40 / duration));
        }
        const totalFrames = Math.floor(duration * fps);
        
        video.pause();

        for (let i = 0; i <= totalFrames; i++) {
          if (isCancelled) return;

          const targetTime = i / fps;
          
          if (Math.abs(video.currentTime - targetTime) > 0.01) {
            video.currentTime = targetTime;
            await new Promise<void>((resolve) => {
              const handleSeeked = () => {
                video.removeEventListener('seeked', handleSeeked);
                resolve();
              };
              video.addEventListener('seeked', handleSeeked);
            });
          }

          if (canvas.width > 0 && canvas.height > 0) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const bitmap = await createImageBitmap(canvas);
            framesRef.current.push(bitmap);
          }
          
          setProgress(Math.round((i / totalFrames) * 100));
        }

        // Render the starting frame immediately (the last frame since rendering is reversed)
        if (framesRef.current.length > 0 && canvas && ctx) {
          const startingFrame = framesRef.current[framesRef.current.length - 1];
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(startingFrame, 0, 0);
        }

        window.scrollTo(0, 0); 
        setIsReady(true);
      } catch (error) {
        // Handle gracefully: skip extraction but allow progress to complete so loader is dismissed
        setProgress(100);
        setIsReady(true);
      }
    };

    initPreRender();

    return () => {
      isCancelled = true;
      framesRef.current.forEach(bmp => bmp.close());
    };
  }, [src]);

  // ScrollTrigger frame scrubbing and pinning logic
  useGSAP(() => {
    if (!isReady || !animationComplete) return;

    ScrollTrigger.refresh();

    const trigger = ScrollTrigger.create({
      trigger: ".video-section",
      start: "top top",
      end: "+=200%", // Pinned scroll distance (adjust this value to make scroll shorter/longer)
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const reversedFraction = 1 - progress;
        
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        if (!canvas || !ctx) return;

        const totalFrames = framesRef.current.length;
        if (totalFrames > 0) {
          let frameIndex = Math.floor(reversedFraction * totalFrames);
          if (frameIndex >= totalFrames) frameIndex = totalFrames - 1;
          if (frameIndex < 0) frameIndex = 0;

          const bitmap = framesRef.current[frameIndex];
          if (bitmap && canvas.width > 0 && canvas.height > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bitmap, 0, 0);
          }
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, [isReady, animationComplete]);

  // GSAP Preloader Animation
  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const loadingLetter = container.querySelectorAll(".willem__letter");
    const box = container.querySelectorAll(".willem-loader__box");
    const growingImage = container.querySelectorAll(".willem__growing-image");
    const headingStart = container.querySelectorAll(".willem__h1-start");
    const headingEnd = container.querySelectorAll(".willem__h1-end");
    const coverImageExtra = container.querySelectorAll(".willem__cover-image-extra");
    const headerLetter = container.querySelectorAll(".willem__letter-white");
    const navLinks = container.querySelectorAll(".willen-nav a, .osmo-credits__p");

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        gsap.to(".willem-loader", {
          opacity: 0,
          pointerEvents: "none",
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => setAnimationComplete(true)
        });
      }
    });

    tl.from(loadingLetter, { 
      yPercent: 100, 
      stagger: 0.025, 
      duration: 1.25 
    });

    tl.fromTo(box, 
      { width: "0em" }, 
      { width: "1em", duration: 1.25 }, 
      "< 1.25"
    );

    tl.fromTo(growingImage, 
      { width: "0%" }, 
      { width: "100%", duration: 1.25 }, 
      "<"
    );

    tl.fromTo(headingStart, 
      { x: "0em", y: "0em" }, 
      { x: "-0.12em", y: "0.05em", duration: 1.25 }, 
      "<"
    );

    tl.fromTo(headingEnd, 
      { x: "0em", y: "0em" }, 
      { x: "0.12em", y: "0.05em", duration: 1.25 }, 
      "<"
    );

    tl.fromTo(coverImageExtra, 
      { opacity: 1 }, 
      { opacity: 0, duration: 0.05, ease: "none", stagger: 0.5 }, 
      "-=0.05"
    );

    tl.to(growingImage, { 
      width: "109vw", 
      height: "100vh", 
      duration: 2 
    }, "< 1.25");

    tl.to(box, { 
      width: "110vw", 
      duration: 2 
    }, "<");

    if (headerLetter.length > 0) {
      // Set the container opacity to 1 so the slide-up of white letters can be seen
      gsap.set(".willem-header__content", { opacity: 1 });

      tl.from(headerLetter, { 
        yPercent: 100, 
        duration: 1.25, 
        ease: "expo.out", 
        stagger: 0.025 
      }, "< 1.2");
    }

    if (navLinks.length > 0) {
      tl.from(navLinks, {
        yPercent: 100,
        duration: 1.25,
        ease: "expo.out",
        stagger: 0.1
      }, "<");
    }
  }, { scope: containerRef });

  // Handle body scroll lock
  useEffect(() => {
    if (!animationComplete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [animationComplete]);

  return (
    <div className={`w-full min-h-screen bg-zinc-950 text-white relative overflow-x-hidden ${!animationComplete ? 'overflow-hidden' : ''}`}>
      
      {/* Pinned Video & Overlay Section */}
      <section className="video-section w-full h-screen relative bg-zinc-950 overflow-hidden" ref={containerRef}>
        
        {/* Canvas / Frame Render Layer */}
        <div className={`absolute inset-0 w-full h-full z-0 flex justify-center bg-zinc-950 transition-opacity duration-1000 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            muted
            playsInline
            preload="auto"
            crossOrigin="anonymous"
            src={src}
          />
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Loader panel (blocks interaction during loading/intro animation) */}
        {!animationComplete && (
          <div className="willem-loader pointer-events-auto z-[100]">
            <div className="willem__h1">
              <div className="willem__h1-start">
                <span className="willem__letter font-amharic-bold">አ</span>
                <span className="willem__letter font-amharic-bold">ን</span>
              </div>
              <div className="willem-loader__box">
                <div className="willem-loader__box-inner">
                  <div className="willem__growing-image">
                    <div className="willem__growing-image-wrap">
                      <img className="willem__cover-image-extra is--1" src="https://andegnafurniture.com/wp-content/uploads/2025/05/AND05766-copy-2-scaled.jpg" alt="" />
                      <img className="willem__cover-image-extra is--2" src="https://andegnafurniture.com/wp-content/uploads/2026/03/photo_4_2026-03-10_18-04-25.jpg" alt="" />
                      <img className="willem__cover-image-extra is--3" src="https://andegnafurniture.com/wp-content/uploads/2026/03/photo_5_2026-03-10_17-41-11-768x512.jpg" alt="" />
                      <img className="willem__cover-image" src="https://i.postimg.cc/9MskXVgW/andegna-hero-Cover.jpg" alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="willem__h1-end">
                <span className="willem__letter font-amharic-bold">ደ</span>
                <span className="willem__letter font-amharic-bold">ኛ</span>
              </div>
            </div>

            {/* Processing Indicator during extraction */}
            {!isReady && (
              <div className="absolute bottom-12 flex flex-col items-center space-y-2 opacity-50 z-50">
                <div className="w-48 h-1 bg-black/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black/40 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest font-amharic-light">
                  Loading Frame Data {progress}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Video Overlay Content Layer (permanently overlayed over the video canvas) */}
        <div className="willem-header__content absolute inset-0 w-full h-full z-50 flex flex-col justify-between p-12 pointer-events-none">
          <div className="willem-header__top" />
          <div className="willem-header__bottom pointer-events-auto" style={{ marginBottom: "-11px" }}>
            <div className="select-none overflow-hidden flex items-end">
              <img 
                src="https://andegnafurniture.com/wp-content/uploads/2022/07/logo-final.png" 
                alt="Andegna Furniture" 
                className="willem__letter-white h-[9rem] md:h-[12rem] w-auto object-contain block" 
                style={{ filter: "none", marginTop: "0px", marginRight: "0px", marginBottom: "-43px" }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Native scrolling content sections */}
      {animationComplete && (
        <div className="relative z-20 bg-zinc-950 text-white select-none">
          {/* Section 1: Circular Gallery / Masterpieces */}
          <section 
            ref={galleryContainerRef}
            className="w-full h-screen min-h-[600px] flex flex-col md:flex-row items-center justify-between overflow-hidden transition-colors duration-700 ease-in-out relative border-t border-zinc-800/40"
            style={{ backgroundColor: translations[galleryLang].gallery[activeIndex].color }}
          >
            {/* Ambient Blurred Background Image */}
            <AnimatePresence>
              {translations[galleryLang].gallery[activeIndex].bgImage && (
                <motion.div
                  key={translations[galleryLang].gallery[activeIndex].bgImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 w-full h-full z-0 scale-110 pointer-events-none"
                  style={{ 
                    backgroundImage: `url("${translations[galleryLang].gallery[activeIndex].bgImage}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(0.1px) brightness(0.4)'
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content Column (Left Side) */}
            <div className="flex-1 flex flex-col items-start justify-center text-white p-8 md:p-16 z-10 relative">
              
              {/* Dynamic Tag/Badge */}
              <div className="mb-4">
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-1">
                  {translations[galleryLang].subtitle}
                </span>
                <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                  {translations[galleryLang].title}
                </span>
              </div>

              {/* Slide-Up Text Container */}
              <div className="max-w-xl md:max-w-2xl flex flex-col gap-6 mt-4">
                <div className="overflow-hidden">
                  <h2 className={`gallery-reveal-text text-4xl md:text-[4.5rem] md:leading-none font-bold tracking-tight m-0 ${galleryLang === 'am' ? 'font-amharic-bold' : ''}`}>
                    {translations[galleryLang].gallery[displayIndex].text}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <p className={`gallery-reveal-text text-base md:text-xl text-zinc-300 leading-relaxed m-0 ${galleryLang === 'am' ? 'font-amharic-light' : ''}`}>
                    {translations[galleryLang].gallery[displayIndex].description}
                  </p>
                </div>
              </div>

              {/* Interactive Info Indicators & Lang Switcher */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                {/* Active Indicator dots */}
                <div className="flex gap-2">
                  {translations[galleryLang].gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-amber-500' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'}`}
                    />
                  ))}
                </div>

                <div className="text-zinc-500 text-xs font-mono">
                  {activeIndex + 1} / {translations[galleryLang].gallery.length} • DRAG TO ROTATE
                </div>
              </div>
            </div>

            {/* Circular WebGL Gallery Column (Right Side) */}
            <div className="w-full md:w-[45%] lg:w-[50%] h-[50vh] md:h-full relative shrink-0 z-10 flex items-center justify-center">
              <CircularGallery 
                items={translations[galleryLang].gallery}
                bend={-3} 
                textColor="#ffffff" 
                borderRadius={0.08} 
                scrollSpeed={1.5}
                scrollEase={0.05}
                onActiveIndexChange={setActiveIndex}
                font={galleryLang === 'am' ? '30px Bela-Hidase-Bold' : 'bold 30px Figtree'}
              />
            </div>
          </section>
        </div>
      )}

    </div>
  );
}

