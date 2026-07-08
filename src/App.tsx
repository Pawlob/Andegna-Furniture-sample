/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function App() {
  const containerRef = useRef<HTMLElement>(null);

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
      onStart: () => {
        container.classList.remove('is--hidden');
      },
      onComplete: () => {
        container.classList.remove('is--loading');
      }
    });

    if (loadingLetter.length) tl.from(loadingLetter, { yPercent: 100, stagger: 0.025, duration: 1.25 });
    if (box.length) {
      tl.fromTo(box, { width: "0em" }, { width: "1em", duration: 1.25 }, "< 1.25");
      tl.fromTo(growingImage, { width: "0%" }, { width: "100%", duration: 1.25 }, "<");
    }
    if (headingStart.length) tl.fromTo(headingStart, { x: "0em", y: "0em" }, { x: "-0.12em", y: "0.05em", duration: 1.25 }, "<");
    if (headingEnd.length) tl.fromTo(headingEnd, { x: "0em", y: "0em" }, { x: "0.12em", y: "0.05em", duration: 1.25 }, "<");
    if (coverImageExtra.length) {
      tl.fromTo(coverImageExtra, { opacity: 1 }, { opacity: 0, duration: 0.05, ease: "none", stagger: 0.5 }, "-=0.05");
    }
    if (growingImage.length) tl.to(growingImage, { width: "109vw", height: "100dvh", duration: 2 }, "< 1.25");
    if (box.length) tl.to(box, { width: "110vw", duration: 2 }, "<");
    if (headerLetter.length) {
      tl.from(headerLetter, { yPercent: 100, duration: 1.25, ease: "expo.out", stagger: 0.025 }, "< 1.2");
    }
    if (navLinks.length) {
      tl.from(navLinks, { yPercent: 100, duration: 1.25, ease: "expo.out", stagger: 0.1 }, "<");
    }
  }, { scope: containerRef });

  return (
    <main>
      <section className="willem-header is--loading is--hidden" ref={containerRef}>
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
                    <img className="willem__cover-image-extra is--1" src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" loading="lazy" alt="" />
                    <img className="willem__cover-image-extra is--2" src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800" loading="lazy" alt="" />
                    <img className="willem__cover-image-extra is--3" src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800" loading="lazy" alt="" />
                    <img className="willem__cover-image" src="https://i.postimg.cc/1XV8Sp7d/mixboard-image-(5).png" loading="lazy" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="willem__h1-end">
              <span className="willem__letter font-amharic-bold">ደ</span>
              <span className="willem__letter font-amharic-bold">ኛ</span>
            </div>
          </div>
        </div>
        <div className="willem-header__content">
          <div className="willem-header__top">
            <nav className="willen-nav">
              <div className="willem-nav__start font-amharic-bold">
                <a href="#" rel="noreferrer" className="willem-nav__link pt-0 pl-0 ml-0 -mr-[100px] mt-0">ስፔሻሊቲ የጥርስ ህክምና</a>
              </div>

            </nav>
          </div>
          <div className="willem-header__bottom">
            <div className="willem__h1">
              <span className="willem__letter-white font-amharic-bold">አ</span>
              <span className="willem__letter-white font-amharic-bold">ን</span>
              <span className="willem__letter-white font-amharic-bold">ደ</span>
              <span className="willem__letter-white font-amharic-bold">ኛ</span>
              <span className="willem__letter-white font-amharic-bold is--space">©</span>
            </div>
            <p className="osmo-credits__p font-amharic-light">ንድፍ በ <a href="#" rel="noreferrer" className="osmo-credits__p-a">ጳውሎስ</a></p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative w-full bg-[#f4f4f4] text-[#201d1d] py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-medium tracking-tight font-amharic-bold mb-6">
                Transform<br />
                <span className="italic text-black/40">Your Smile.</span>
              </h2>
              <p className="text-xl md:text-2xl text-black/60 leading-relaxed max-w-lg font-amharic-light">
                Experience confidence with a healthy smile. Expert care for your family's dental needs.
              </p>
            </div>
            <div className="hidden md:block">
              <button className="rounded-full border border-black/20 px-8 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300">
                Book Visit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                <img 
                  src="https://smilespecialtydentalclinic.com/wp-content/uploads/2026/03/DSC07486-1-640x640.webp" 
                  alt="Specialized Team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <h3 className="text-2xl font-medium mb-2 font-amharic-bold">Specialized Team</h3>
              <p className="text-black/60 font-amharic-light">Committed to excellence with compassionate dental care.</p>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                <img 
                  src="https://smilespecialtydentalclinic.com/wp-content/uploads/2023/04/doc-4-640x640.jpg" 
                  alt="Clear Aligners" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <h3 className="text-2xl font-medium mb-2 font-amharic-bold">Clear Aligners</h3>
              <p className="text-black/60 font-amharic-light">Straighten your teeth with invisible aligners for a confident smile.</p>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                <img 
                  src="https://smilespecialtydentalclinic.com/wp-content/uploads/2023/04/doc-3-320x320.jpg" 
                  alt="Family Care" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <h3 className="text-2xl font-medium mb-2 font-amharic-bold">Family Care</h3>
              <p className="text-black/60 font-amharic-light">Comprehensive dental treatments for patients of all ages.</p>
            </div>
          </div>
          
          <div className="mt-12 md:hidden">
              <button className="w-full rounded-full border border-black/20 px-8 py-4 text-sm tracking-widest uppercase hover:bg-black hover:text-white transition-colors duration-300">
                Book Visit
              </button>
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <section className="relative w-full bg-[#141414] text-white py-24 px-6 md:px-12 lg:px-24 rounded-t-[3rem] -mt-12 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-medium tracking-tighter font-amharic-bold leading-[0.8] mb-8">
            <span className="opacity-50">Smiles that</span><br />
            SHINE.
          </h2>
          
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl font-amharic-light">
            Book your visit at Smile Specialty Dental Center today and take the first step towards a healthier, brighter smile.
          </p>

          <button className="rounded-full bg-white text-black px-10 py-5 text-sm tracking-widest uppercase hover:bg-white/90 hover:scale-105 transition-all duration-300 mb-24">
            Contact Our Team
          </button>

          <div className="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase text-white/40">
            <span>© 2026 Smile Specialty Dental Center</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
