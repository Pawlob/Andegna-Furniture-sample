'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Sliders, 
  X, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Compass, 
  ArrowRight,
  ClipboardCheck,
  ShoppingBag,
  Info
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

import HeroGallery from '@/components/HeroGallery';

interface Product {
  id: string;
  name: string;
  category: 'living' | 'dining' | 'bedroom';
  basePrice: number;
  image: string;
  description: string;
  dimensions: { minW: number; maxW: number; defaultW: number; minD: number; maxD: number; defaultD: number };
}

const PRODUCTS: Product[] = [
  {
    id: 'sectional-1',
    name: 'Andegna Heritage Sectional',
    category: 'living',
    basePrice: 2450,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800',
    description: 'A masterpiece of modern luxury comfort blended with subtle Ethiopian-inspired geometric hand-carved accents along the timber frame.',
    dimensions: { minW: 180, maxW: 320, defaultW: 240, minD: 90, maxD: 110, defaultD: 95 }
  },
  {
    id: 'table-1',
    name: 'Abyssinian Dining Table',
    category: 'dining',
    basePrice: 1850,
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800',
    description: 'A solid hardwood dining table built to last generations, featuring hand-finished natural timber details and robust traditional joinery.',
    dimensions: { minW: 160, maxW: 260, defaultW: 200, minD: 80, maxD: 110, defaultD: 90 }
  },
  {
    id: 'bed-1',
    name: 'Semien Floating Bed Frame',
    category: 'bedroom',
    basePrice: 1950,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    description: 'An elegant floating platform bed handcrafted with clean horizontal lines, integrated soft mood lighting, and bespoke grain motifs.',
    dimensions: { minW: 150, maxW: 220, defaultW: 180, minD: 190, maxD: 220, defaultD: 200 }
  },
  {
    id: 'chair-1',
    name: 'Lalibela Accent Chair',
    category: 'living',
    basePrice: 750,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800',
    description: 'An architectural lounge chair designed to make an impact, boasting premium solid wood joinery and rich customizable cushioning.',
    dimensions: { minW: 70, maxW: 95, defaultW: 80, minD: 70, maxD: 90, defaultD: 80 }
  },
  {
    id: 'credenza-1',
    name: 'Gondar Heritage Credenza',
    category: 'dining',
    basePrice: 1600,
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800',
    description: 'A spectacular storage sideboard with custom geometric hand-carved doors inspired by the historic architecture of Gondar.',
    dimensions: { minW: 140, maxW: 220, defaultW: 180, minD: 45, maxD: 60, defaultD: 50 }
  },
  {
    id: 'nightstand-1',
    name: 'Axum Nightstand Trio',
    category: 'bedroom',
    basePrice: 480,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
    description: 'A minimal freestanding nightstand crafted from premium hardwood featuring a whisper-quiet single drawer and cable pass-through.',
    dimensions: { minW: 45, maxW: 70, defaultW: 55, minD: 40, maxD: 55, defaultD: 45 }
  }
];

const WOOD_OPTIONS = [
  { id: 'mahogany', name: 'Royal Mahogany', cost: 150, color: '#6A2A18', desc: 'Deep reddish-brown luxury timber with structural resilience.' },
  { id: 'walnut', name: 'Abyssinian Walnut', cost: 200, color: '#3E2A1E', desc: 'Premium deep chocolate tone showing magnificent natural wave grains.' },
  { id: 'oak', name: 'Golden Oak', cost: 100, color: '#C19A6B', desc: 'Warm honey hue with a modern design feel and extreme durability.' },
];

const FABRIC_OPTIONS = [
  { id: 'cotton', name: 'Artisanal Handwoven Cotton', cost: 120, color: '#F1E9D2', desc: 'Beautifully textured, off-white heavy heritage weave.' },
  { id: 'velvet', name: 'Golden Amber Velvet', cost: 180, color: '#cfa253', desc: 'Lustrous, heavy-weight velvet with a warm golden amber sheen.' },
  { id: 'leather', name: 'Premium Cognac Leather', cost: 250, color: '#8E4A21', desc: 'Buttery-soft full-grain leather that patinas beautifully over time.' },
];

interface CustomInquiry {
  id: string;
  product: Product;
  wood: typeof WOOD_OPTIONS[0];
  fabric: typeof FABRIC_OPTIONS[0];
  width: number;
  depth: number;
  totalPrice: number;
}

export default function Page() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Customizer State
  const [activeCategory, setActiveCategory] = useState<'all' | 'living' | 'dining' | 'bedroom'>('all');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<number>(100);
  const [customDepth, setCustomDepth] = useState<number>(100);
  
  // Cart / Inquiries State
  const [inquiries, setInquiries] = useState<CustomInquiry[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Lead submission form
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load inquiries from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('andegna_custom_inquiries');
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading custom inquiries', e);
      }
    }
  }, []);

  const saveInquiries = (items: CustomInquiry[]) => {
    setInquiries(items);
    localStorage.setItem('andegna_custom_inquiries', JSON.stringify(items));
  };

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
        gsap.to(container, {
          opacity: 0,
          y: -80,
          duration: 1.0,
          ease: 'power3.inOut',
          onComplete: () => {
            setIsLoaded(true);
          }
        });
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

  // Customizer calculations
  const calculatePrice = (product: Product, woodId: string, fabricId: string, width: number, depth: number) => {
    const wood = WOOD_OPTIONS.find(w => w.id === woodId);
    const fabric = FABRIC_OPTIONS.find(f => f.id === fabricId);
    
    const woodCost = wood ? wood.cost : 0;
    const fabricCost = fabric ? fabric.cost : 0;
    
    // Dimension scale factor (relative to default model)
    const defaultArea = product.dimensions.defaultW * product.dimensions.defaultD;
    const selectedArea = width * depth;
    const scaleRatio = selectedArea / defaultArea;
    const dimensionMultiplierCost = Math.round((product.basePrice * (scaleRatio - 1)) * 0.4); // 40% material premium
    
    return product.basePrice + woodCost + fabricCost + dimensionMultiplierCost;
  };

  const handleOpenCustomizer = (product: Product) => {
    setCustomizingProduct(product);
    setSelectedWood(WOOD_OPTIONS[0].id);
    setSelectedFabric(FABRIC_OPTIONS[0].id);
    setCustomWidth(product.dimensions.defaultW);
    setCustomDepth(product.dimensions.defaultD);
  };

  const handleAddInquiry = () => {
    if (!customizingProduct) return;
    
    const wood = WOOD_OPTIONS.find(w => w.id === selectedWood) || WOOD_OPTIONS[0];
    const fabric = FABRIC_OPTIONS.find(f => f.id === selectedFabric) || FABRIC_OPTIONS[0];
    const price = calculatePrice(customizingProduct, wood.id, fabric.id, customWidth, customDepth);

    const newItem: CustomInquiry = {
      id: `${Date.now()}`,
      product: customizingProduct,
      wood,
      fabric,
      width: customWidth,
      depth: customDepth,
      totalPrice: price
    };

    saveInquiries([...inquiries, newItem]);
    setCustomizingProduct(null);
    setIsDrawerOpen(true);
  };

  const handleDeleteInquiry = (id: string) => {
    const filtered = inquiries.filter(item => item.id !== id);
    saveInquiries(filtered);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API lead generation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        saveInquiries([]);
        setSubmitSuccess(false);
        setShowInquiryForm(false);
        setIsDrawerOpen(false);
        setClientName('');
        setClientPhone('');
        setClientEmail('');
        setClientNotes('');
      }, 3000);
    }, 1500);
  };

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <main className="bg-[#fcfaf7] min-h-screen text-[#121110] overflow-x-hidden selection:bg-[#d4af37] selection:text-[#121110]">
      {!isLoaded ? (
        <section className="willem-header is--loading is--hidden" ref={containerRef as any}>
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
            <div className="flex-grow" />
            <div className="willem-header__bottom" style={{ marginTop: '0px', paddingLeft: '0px', marginBottom: '-60px' }}>
              <div className="willem__h1 h-[2.4em] lg:h-[1.5em] flex items-center overflow-hidden">
                <img 
                  src="https://andegnafurniture.com/wp-content/uploads/2022/07/logo-final-300x169.png.webp" 
                  alt="Andegna" 
                  className="willem__letter-white h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <HeroGallery />

      {/* Floating Design Inquiries Badge */}
      {isMounted && inquiries.length > 0 && (
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#121110] text-[#d4af37] border border-[#d4af37]/30 px-6 py-4 rounded-full shadow-2xl hover:bg-[#1a1410] hover:border-[#d4af37] transition-all duration-300 hover:scale-105 active:scale-95 group"
          id="floating-cart-btn"
        >
          <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 text-[#d4af37]" />
          <span className="text-sm font-medium tracking-wider uppercase font-mono">Inquiries ({inquiries.length})</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
          </span>
        </button>
      )}

      {/* Catalog & Filter Section */}
      <section className="relative w-full py-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#4a3525]/10 pb-12">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-[#8b5a2b] font-medium block mb-3 font-mono">Collection Showcase</span>
              <h2 className="text-5xl md:text-7xl font-light tracking-tight font-amharic-bold mb-6">
                Curated<br />
                <span className="italic font-serif text-[#cfa253]">Luxe Living.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#121110]/70 leading-relaxed font-light">
                Exceptional bespoke design for modern residential and executive spaces. Handcrafted in Ethiopia using premium timber and rich, textured materials.
              </p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'living', 'dining', 'bedroom'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-[#121110] text-[#d4af37] border border-[#d4af37]' 
                      : 'border border-[#4a3525]/20 text-[#121110] hover:border-[#d4af37] hover:bg-[#121110]/5'
                  }`}
                >
                  {cat === 'all' ? 'All Pieces' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout of Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col justify-between bg-white rounded-3xl p-5 border border-[#4a3525]/10 hover:border-[#d4af37]/50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(74,53,37,0.05)]"
              >
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-gray-50">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Category pill */}
                    <span className="absolute top-4 left-4 bg-[#121110]/90 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/30 px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-mono font-bold">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-medium tracking-tight font-amharic-bold">{product.name}</h3>
                    <span className="text-sm font-semibold tracking-wider font-mono text-[#8b5a2b]">From ${product.basePrice}</span>
                  </div>
                  <p className="text-[#121110]/60 text-sm leading-relaxed mb-6 font-light">{product.description}</p>
                </div>

                <button 
                  onClick={() => handleOpenCustomizer(product)}
                  className="w-full rounded-full border border-[#4a3525]/20 py-4 text-xs tracking-widest uppercase text-[#121110] hover:bg-[#121110] hover:text-[#d4af37] hover:border-[#d4af37] transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-[#4a3525]"
                >
                  <Sliders className="w-4 h-4" />
                  Customize & Estimate
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Bento Grid */}
      <section className="relative w-full bg-[#121110] text-[#fcfaf7] py-24 px-6 md:px-12 lg:px-24 rounded-t-[3rem] z-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="text-xs uppercase tracking-widest text-[#fcfaf7]/40 font-medium block mb-3 font-mono">Heritage & Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight font-amharic-bold">
              The Convergence of <br />
              <span className="italic font-serif text-[#d4af37]">Cultural Artistry</span> & Luxury.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1c1510] border border-[#d4af37]/10 hover:border-[#d4af37]/40 p-8 md:p-10 rounded-3xl flex flex-col justify-between h-96 hover:translate-y-[-4px] transition-all duration-300">
              <Compass className="w-10 h-10 text-[#d4af37]" />
              <div>
                <h3 className="text-2xl font-medium mb-3 font-amharic-bold">Sourcing</h3>
                <p className="text-[#fcfaf7]/60 text-sm leading-relaxed">
                  We sustainably harvest only mature local hardwoods like Royal Abyssinian Walnut and structural Mahogany, ensuring every piece celebrates natural grains while preserving forestry.
                </p>
              </div>
            </div>

            <div className="bg-[#1c1510] border border-[#d4af37]/10 hover:border-[#d4af37]/40 p-8 md:p-10 rounded-3xl flex flex-col justify-between h-96 hover:translate-y-[-4px] transition-all duration-300">
              <Sparkles className="w-10 h-10 text-[#d4af37]" />
              <div>
                <h3 className="text-2xl font-medium mb-3 font-amharic-bold">Cultural Craft</h3>
                <p className="text-[#fcfaf7]/60 text-sm leading-relaxed">
                  Our master carvers introduce subtle Ethiopian architectural forms and iconic geometric patterns, turning high-end furniture items into literal statements of art.
                </p>
              </div>
            </div>

            <div className="bg-[#1c1510] border border-[#d4af37]/10 hover:border-[#d4af37]/40 p-8 md:p-10 rounded-3xl flex flex-col justify-between h-96 hover:translate-y-[-4px] transition-all duration-300">
              <ArrowRight className="w-10 h-10 text-[#d4af37]" />
              <div>
                <h3 className="text-2xl font-medium mb-3 font-amharic-bold">Bespoke Fit</h3>
                <p className="text-[#fcfaf7]/60 text-sm leading-relaxed">
                  We customize the scale, wood selection, and textiles of any collection item to fit your architectural proportions. Get calculated estimates instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showrooms & Info */}
      <section className="relative w-full py-24 px-6 md:px-12 lg:px-24 bg-[#fbf9f4]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#8b5a2b] font-medium block mb-3 font-mono">Showroom Location</span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight font-amharic-bold mb-8">
              Experience the Craft <br />
              <span className="italic font-serif text-[#8b5a2b]">In Person.</span>
            </h2>
            <p className="text-lg text-[#121110]/70 leading-relaxed mb-12 font-light">
              Visit our luxury showroom in Addis Ababa to feel the rich grain of Abyssinian Walnut and select custom handwoven cotton fabrics in collaboration with our designers.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#8b5a2b] mt-1" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-xs">Flagship Showroom</h4>
                  <p className="text-[#121110]/70 text-sm mt-1">Bole Road, Next to Andegna Plaza, Addis Ababa, Ethiopia</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#8b5a2b] mt-1" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-xs">Contact Inquiries</h4>
                  <p className="text-[#121110]/70 text-sm mt-1">+251 911 234 567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#8b5a2b] mt-1" />
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-xs">Email Correspondence</h4>
                  <p className="text-[#121110]/70 text-sm mt-1">info@andegnafurniture.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-black/5 bg-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200" 
              alt="Andegna Showroom Interior" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Footer / Call to Action */}
      <section className="relative w-full bg-[#0e0c0b] border-t border-[#d4af37]/20 text-white py-24 px-6 md:px-12 lg:px-24 rounded-t-[3rem] -mt-12 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-medium tracking-tighter font-amharic-bold leading-[0.8] mb-8">
            <span className="opacity-50">Spaces that</span><br />
            <span className="text-[#d4af37]">INSPIRE.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-xl font-amharic-light">
            Transform your space with Andegna Furniture today. Build custom items to create your design quote instantly.
          </p>

          <button 
            onClick={() => {
              const element = document.getElementById('floating-cart-btn');
              if (element) {
                element.click();
              } else {
                setActiveCategory('all');
                window.scrollTo({ top: 800, behavior: 'smooth' });
              }
            }}
            className="rounded-full bg-[#d4af37] text-black border border-[#b8952d] px-10 py-5 text-sm tracking-widest uppercase hover:bg-[#cfa253] hover:scale-105 transition-all duration-300 mb-24 font-bold"
          >
            Start Customization
          </button>

          <div className="w-full border-t border-[#d4af37]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase text-white/40 font-mono">
            <span>© 2026 Andegna Furniture</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-[#d4af37] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#d4af37] transition-colors">Facebook</a>
              <a href="#" className="hover:text-[#d4af37] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMIZER MODAL */}
      {customizingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative bg-[#fcfaf7] text-[#121110] rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col lg:flex-row border border-[#d4af37]/20">
            
            {/* Modal close */}
            <button 
              onClick={() => setCustomizingProduct(null)}
              className="absolute top-6 right-6 z-10 bg-white/85 hover:bg-[#121110] hover:text-[#d4af37] border border-[#4a3525]/15 text-black p-3 rounded-full hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image & Details Side */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white border-r border-[#4a3525]/5">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-mono text-[#8b5a2b] block mb-3 font-bold">
                  Bespoke Configurator
                </span>
                <h3 className="text-3xl font-light font-amharic-bold mb-4">{customizingProduct.name}</h3>
                <p className="text-sm text-[#121110]/60 leading-relaxed mb-6">
                  {customizingProduct.description}
                </p>
                
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-black/5">
                  <img 
                    src={customizingProduct.image} 
                    alt={customizingProduct.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Instant Price Card */}
              <div className="mt-8 bg-[#fcfaf7] border border-[#d4af37]/20 p-6 rounded-2xl flex justify-between items-center shadow-sm">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-mono block text-[#8b5a2b]">Estimated Price</span>
                  <span className="text-3xl font-bold tracking-tight font-mono text-[#d4af37]">
                    ${calculatePrice(customizingProduct, selectedWood, selectedFabric, customWidth, customDepth)}
                  </span>
                </div>
                <div className="text-right text-[10px] text-[#8b5a2b]/70 font-mono">
                  Includes premium wood,<br />textile and custom scale.
                </div>
              </div>
            </div>

            {/* Customization Options Side */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-[#fbf9f4]">
              <div className="space-y-8">
                {/* 1. Wood Selection */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-mono font-bold mb-4 flex items-center gap-2 text-[#8b5a2b]">
                    <span>01.</span> Wood Finish Selection
                  </h4>
                  <div className="space-y-3">
                    {WOOD_OPTIONS.map((wood) => (
                      <button
                        key={wood.id}
                        onClick={() => setSelectedWood(wood.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 ${
                          selectedWood === wood.id 
                            ? 'border-[#d4af37] bg-[#4a3525]/5 shadow-sm' 
                            : 'border-black/5 hover:border-[#4a3525]/30 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-6 h-6 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: wood.color }}
                          />
                          <div>
                            <span className="font-bold text-sm block">{wood.name}</span>
                            <span className="text-xs text-[#121110]/50 block">{wood.desc}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#8b5a2b]">
                          +{wood.cost > 0 ? `$${wood.cost}` : 'Free'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Fabric Selection */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-mono font-bold mb-4 flex items-center gap-2 text-[#8b5a2b]">
                    <span>02.</span> Textile Selection
                  </h4>
                  <div className="space-y-3">
                    {FABRIC_OPTIONS.map((fabric) => (
                      <button
                        key={fabric.id}
                        onClick={() => setSelectedFabric(fabric.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 ${
                          selectedFabric === fabric.id 
                            ? 'border-[#d4af37] bg-[#4a3525]/5 shadow-sm' 
                            : 'border-black/5 hover:border-[#4a3525]/30 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-6 h-6 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                            style={{ backgroundColor: fabric.color }}
                          />
                          <div>
                            <span className="font-bold text-sm block">{fabric.name}</span>
                            <span className="text-xs text-[#121110]/50 block">{fabric.desc}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#8b5a2b]">
                          +{fabric.cost > 0 ? `$${fabric.cost}` : 'Free'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Custom Sizing Sliders */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-mono font-bold mb-4 flex items-center gap-2 text-[#8b5a2b]">
                    <span>03.</span> Scale & Custom Dimensions
                  </h4>
                  <div className="space-y-6 bg-white border border-[#4a3525]/5 p-6 rounded-2xl">
                    {/* Width slider */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-2">
                        <span>Width (Length)</span>
                        <span className="font-bold text-[#8b5a2b]">{customWidth} cm</span>
                      </div>
                      <input 
                        type="range" 
                        min={customizingProduct.dimensions.minW} 
                        max={customizingProduct.dimensions.maxW} 
                        value={customWidth} 
                        onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                        className="w-full accent-[#d4af37] bg-black/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-black/30 font-mono mt-1">
                        <span>Min: {customizingProduct.dimensions.minW}cm</span>
                        <span>Standard: {customizingProduct.dimensions.defaultW}cm</span>
                        <span>Max: {customizingProduct.dimensions.maxW}cm</span>
                      </div>
                    </div>

                    {/* Depth slider */}
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-2">
                        <span>Depth (Width)</span>
                        <span className="font-bold text-[#8b5a2b]">{customDepth} cm</span>
                      </div>
                      <input 
                        type="range" 
                        min={customizingProduct.dimensions.minD} 
                        max={customizingProduct.dimensions.maxD} 
                        value={customDepth} 
                        onChange={(e) => setCustomDepth(parseInt(e.target.value))}
                        className="w-full accent-[#d4af37] bg-black/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-black/30 font-mono mt-1">
                        <span>Min: {customizingProduct.dimensions.minD}cm</span>
                        <span>Standard: {customizingProduct.dimensions.defaultD}cm</span>
                        <span>Max: {customizingProduct.dimensions.maxD}cm</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#4a3525]/10">
                <button 
                  onClick={handleAddInquiry}
                  className="w-full bg-[#121110] text-[#d4af37] border border-[#d4af37] rounded-full py-4 text-xs font-mono tracking-widest uppercase hover:bg-[#1a1410] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                >
                  <Plus className="w-4 h-4" />
                  Add to Custom Inquiries
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PERSISTENT INQUIRIES DRAWER */}
      {isMounted && isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#fcfaf7] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-[#d4af37]/20">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#4a3525]/10 pb-6 mb-6">
                <div>
                  <h3 className="text-2xl font-light font-amharic-bold">Bespoke Inquiries</h3>
                  <p className="text-xs text-[#8b5a2b] uppercase tracking-widest font-mono mt-1">Estimations & Custom Builds</p>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="bg-[#4a3525]/10 hover:bg-[#4a3525]/20 text-[#4a3525] p-2.5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Inquiry list */}
              {inquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-black/40">
                  <Sliders className="w-12 h-12 stroke-[1.2] mb-4 text-[#8b5a2b]" />
                  <p className="font-light">No custom designs configured yet.</p>
                  <button 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setActiveCategory('all');
                      window.scrollTo({ top: 800, behavior: 'smooth' });
                    }}
                    className="text-[#8b5a2b] hover:text-[#d4af37] underline text-xs tracking-widest uppercase font-bold mt-4"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
                  {inquiries.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white border border-[#4a3525]/10 p-5 rounded-2xl relative flex gap-4 group hover:border-[#d4af37]/50 transition-all duration-300"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-black/5">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm tracking-tight">{item.product.name}</h4>
                        <div className="text-[10px] space-y-1 mt-2 text-black/60 font-mono">
                          <p>• Wood: <span className="text-[#8b5a2b] font-semibold">{item.wood.name}</span></p>
                          <p>• Textile: <span className="text-[#8b5a2b] font-semibold">{item.fabric.name}</span></p>
                          <p>• Sizing: <span className="text-[#8b5a2b] font-semibold">{item.width}w × {item.depth}d cm</span></p>
                        </div>
                        <div className="text-sm font-semibold tracking-wider font-mono mt-3 text-[#d4af37]">
                          Est: ${item.totalPrice}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDeleteInquiry(item.id)}
                        className="absolute top-4 right-4 text-black/40 hover:text-red-500 transition-colors p-1"
                        title="Remove custom build"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions and Inquiry form triggers */}
            {inquiries.length > 0 && (
              <div className="border-t border-[#4a3525]/10 pt-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#8b5a2b] font-mono">Total Estimated Valuation</span>
                    <span className="text-2xl font-bold tracking-tight font-mono text-[#d4af37] block">
                      ${inquiries.reduce((sum, item) => sum + item.totalPrice, 0)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8b5a2b]/70 text-right font-mono max-w-[150px]">
                    Estimates exclude freight taxes. Subject to showroom alignment.
                  </span>
                </div>

                {!showInquiryForm ? (
                  <button 
                    onClick={() => setShowInquiryForm(true)}
                    className="w-full bg-[#121110] hover:bg-[#1a1410] text-[#d4af37] border border-[#d4af37]/50 text-xs tracking-widest uppercase py-4 rounded-full font-mono font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    Submit Configuration Inquiry
                  </button>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4 border-t border-[#4a3525]/10 pt-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs uppercase tracking-widest font-mono text-[#8b5a2b] font-bold">Contact Representative</span>
                      <button 
                        type="button"
                        onClick={() => setShowInquiryForm(false)}
                        className="text-xs font-mono text-[#8b5a2b] underline hover:text-[#d4af37]"
                      >
                        Back to List
                      </button>
                    </div>

                    {submitSuccess ? (
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-6 rounded-2xl flex flex-col items-center text-center animate-fade-in">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-3" />
                        <h4 className="font-bold text-sm tracking-tight mb-1">Inquiry Transmitted Successfully</h4>
                        <p className="text-xs opacity-80 leading-relaxed">
                          Your custom layouts have been persisted. Our bole road consultant will coordinate inside 2 hours.
                        </p>
                      </div>
                    ) : (
                      <>
                        <input 
                          type="text" 
                          required
                          placeholder="Your Complete Name" 
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-white border border-[#4a3525]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]"
                        />
                        <input 
                          type="tel" 
                          required
                          placeholder="Your Mobile Phone Number" 
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full bg-white border border-[#4a3525]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]"
                        />
                        <input 
                          type="email" 
                          required
                          placeholder="Your Email Address" 
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full bg-white border border-[#4a3525]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37]"
                        />
                        <textarea 
                          placeholder="Architectural custom notes, preferences or specific wood queries (Optional)" 
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          rows={3}
                          className="w-full bg-white border border-[#4a3525]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] resize-none"
                        />
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#d4af37] text-[#121110] hover:bg-[#cfa253] border border-[#b8952d] py-4 text-xs font-mono tracking-widest uppercase rounded-full transition-all duration-300 font-bold flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <span className="h-4 w-4 border-2 border-[#121110]/30 border-t-[#121110] rounded-full animate-spin"></span>
                          ) : 'Finalize & Request Quotation'}
                        </button>
                      </>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </main>
  );
}
