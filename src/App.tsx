/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

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

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const fps = 10; 
        const duration = video.duration;
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

  // Scroll rendering logic
  useEffect(() => {
    if (!isReady || !animationComplete) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !ctx) return;

    let animationFrameId: number;

    const renderLoop = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      if (maxScroll > 0) {
        const scrollFraction = Math.max(0, Math.min(1, scrollY / maxScroll));
        const totalFrames = framesRef.current.length;
        
        if (totalFrames > 0) {
          let frameIndex = Math.floor(scrollFraction * totalFrames);
          if (frameIndex >= totalFrames) frameIndex = totalFrames - 1;

          const bitmap = framesRef.current[frameIndex];
          if (bitmap && canvas.width > 0 && canvas.height > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bitmap, 0, 0);
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
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
      tl.from(headerLetter, { 
        yPercent: 100, 
        duration: 1.25, 
        ease: "expo.out", 
        stagger: 0.025 
      }, "< 1.2");
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
    <div className={`h-[300vh] relative bg-zinc-950 overflow-x-hidden ${!animationComplete ? 'overflow-hidden' : ''}`}>
      {/* Video Content Layer */}
      <div className={`fixed inset-0 w-full h-full z-0 flex justify-center bg-zinc-950 transition-opacity duration-1000 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={videoRef}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          muted
          playsInline
          preload="auto"
          src={src}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Preloader Layer */}
      {!animationComplete && (
        <section className="fixed inset-0 z-[100] willem-header" ref={containerRef}>
          <div className="willem-loader">
            <div className="willem__h1">
              <div className="willem__h1-start">
                <span className="willem__letter font-amharic-bold">አ</span>
                <span className="willem__letter font-amharic-bold">ን</span>
              </div>
              <div className="willem-loader__box">
                <div className="willem-loader__box-inner">
                  <div className="willem__growing-image">
                    <div className="willem__growing-image-wrap">
                      <img className="willem__cover-image-extra is--1" src="https://smilespecialtydentalclinic.com/wp-content/uploads/2023/04/doc-4-640x640.jpg" alt="" />
                      <img className="willem__cover-image-extra is--2" src="https://smilespecialtydentalclinic.com/wp-content/uploads/2023/04/doc-3-320x320.jpg" alt="" />
                      <img className="willem__cover-image-extra is--3" src="https://smilespecialtydentalclinic.com/wp-content/uploads/2026/03/DSC07486-1-640x640.webp" alt="" />
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
        </section>
      )}


    </div>
  );
}

