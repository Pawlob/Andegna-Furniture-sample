'use client';

import { useEffect, useRef, useState } from 'react';
import { Renderer, Camera, Transform, Texture, Program, Mesh, Plane } from 'ogl';
import gsap from 'gsap';

interface GalleryItem {
  image: string;
  text: string;
  description: string;
  color: string;
  bgImage?: string;
}

const TRANSLATIONS = {
  en: {
    gallery: [
      { image: 'https://i.postimg.cc/mgJPs2Fr/410555648-21ead13a-cb97-4f1c-a1e7-8704f360135d.png', text: 'Bridge', description: 'A structural marvel crossing the waters, connecting two distinct landscapes.', color: '#1a1917' },
      { image: 'https://i.postimg.cc/76yMqNTP/320731638-11288297-(1).png', text: 'Desk Setup', description: 'A clean, minimal workspace designed for focus and productivity.', color: '#3f2723', bgImage: 'https://i.postimg.cc/Gh40wyFM/Gemini-Generated-Image-9i9o939i9o939i9o.png' },
      { image: 'https://i.postimg.cc/pL5PHQHS/409092845-a2ff2545-4a06-44aa-aad6-d165ce7ece0f.png', text: 'Waterfall', description: 'Nature’s raw power cascading down the rocky cliffs.', color: '#0f3a3a', bgImage: 'https://i.postimg.cc/Y0S4R3mm/Watermark-Free-Interior.png' },
      { image: 'https://i.postimg.cc/L6t8YB7M/358181730-11444651-(1).png', text: 'Strawberries', description: 'Fresh, vibrant, and sweet summer fruits.', color: '#4a1525', bgImage: 'https://i.postimg.cc/28vh3HrR/Dark-Wall-Living-Room.png' },
      { image: 'https://i.postimg.cc/Hs6s9spK/412670393-fbcb5734-2019-4045-9a34-6c17c4a3741e-(1).png', text: 'Deep Diving', description: 'Exploring the serene and mysterious underwater world.', color: '#121110' }
    ],
    nav: {
      title1: "About", link1: "Heritage", link2: "Craftsmanship",
      title2: "Collection", link3: "Living Room", link4: "Bedroom & Dining",
      title3: "Contact", link5: "Email Inquiries", link6: "Showroom Location", link7: "Call Representative",
      cta: "Explore Catalog"
    }
  },
  am: {
    gallery: [
      { image: 'https://i.postimg.cc/mgJPs2Fr/410555648-21ead13a-cb97-4f1c-a1e7-8704f360135d.png', text: 'ድልድይ', description: 'ውሃዎችን የሚያቋርጥ እና ሁለት የተለያዩ የመሬት ገጽታዎችን የሚያገናኝ መዋቅራዊ ድንቅ።', color: '#1a1917' },
      { image: 'https://i.postimg.cc/76yMqNTP/320731638-11288297-(1).png', text: 'የጠረጴዛ ዝግጅት', description: 'ለትኩረት እና ለምርታማነት የተነደፈ ንጹህ እና አነስተኛ የስራ ቦታ።', color: '#3f2723', bgImage: 'https://i.postimg.cc/Gh40wyFM/Gemini-Generated-Image-9i9o939i9o939i9o.png' },
      { image: 'https://i.postimg.cc/pL5PHQHS/409092845-a2ff2545-4a06-44aa-aad6-d165ce7ece0f.png', text: 'ፏፏቴ', description: 'የተፈጥሮ ጥሬ ሃይል በዓለታማ ገደሎች ላይ ሲወርድ።', color: '#0f3a3a', bgImage: 'https://i.postimg.cc/Y0S4R3mm/Watermark-Free-Interior.png' },
      { image: 'https://i.postimg.cc/L6t8YB7M/358181730-11444651-(1).png', text: 'እንጆሪ', description: 'ትኩስ፣ ደማቅ እና ጣፋጭ የበጋ ፍራፍሬዎች።', color: '#4a1525', bgImage: 'https://i.postimg.cc/28vh3HrR/Dark-Wall-Living-Room.png' },
      { image: 'https://i.postimg.cc/Hs6s9spK/412670393-fbcb5734-2019-4045-9a34-6c17c4a3741e-(1).png', text: 'ጥልቅ ዳይቪንግ', description: 'ጸጥ ያለውን እና ሚስጥራዊውን የውሃ ውስጥ ዓለም ማሰስ።', color: '#121110' }
    ],
    nav: {
      title1: "ስለ እኛ", link1: "ውርስና ፍልስፍና", link2: "የእጅ ጥበብ",
      title2: "ምርቶች", link3: "ሳሎን እቃዎች", link4: "መኝታና የመመገቢያ",
      title3: "አድራሻ", link5: "በኢሜይል መጠየቅ", link6: "የሾውሩም ቦታ", link7: "ወኪል ያነጋግሩ",
      cta: "ማውጫ ማሰሻ"
    }
  }
};

function createTextTexture(gl: any, text: string, font = 'bold 30px monospace', color = 'white') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return { texture: null, width: 100, height: 30 };
  
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  
  canvas.width = textWidth + 24;
  canvas.height = textHeight + 20;
  
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  gl: any;
  plane: any;
  renderer: any;
  text: string;
  textColor: string;
  font: string;
  mesh: any;

  constructor({ gl, plane, renderer, text, textColor = '#ffffff', font = '30px sans-serif' }: any) {
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    if (!texture) return;
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.14;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.08;
    this.mesh.setParent(this.plane);
  }

  updateText(text: string, font: string) {
    this.text = text;
    this.font = font;
    if (this.mesh) {
      this.mesh.setParent(null);
    }
    this.createMesh();
  }
}

class Media {
  extra: number;
  geometry: any;
  gl: any;
  image: string;
  index: number;
  length: number;
  renderer: any;
  scene: any;
  screen: any;
  text: string;
  viewport: any;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program: any;
  plane: any;
  title: any;
  padding: number = 0;
  height: number = 0;
  heightTotal: number = 0;
  y: number = 0;
  speed: number = 0;
  isBefore: boolean = false;
  isAfter: boolean = false;

  constructor({
    geometry, gl, image, index, length, renderer, scene, screen, text, viewport, bend, textColor, borderRadius = 0, font
  }: any) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.05 + uSpeed * 0.3);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float edgeSmooth = 0.003;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha * color.a);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font
    });
  }

  update(scroll: any, direction: string) {
    this.plane.position.y = this.y + scroll.current + this.extra;
    const y = this.plane.position.y;
    const H = this.viewport.height / 2;

    if (this.bend === 0) {
      this.plane.position.x = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveY = Math.min(Math.abs(y), H);
      const arc = R - Math.sqrt(R * R - effectiveY * effectiveY);
      
      if (this.bend > 0) {
        this.plane.position.x = -arc;
        this.plane.rotation.z = -Math.sign(y) * Math.asin(effectiveY / R);
      } else {
        this.plane.position.x = arc;
        this.plane.rotation.z = Math.sign(y) * Math.asin(effectiveY / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.y / 2;
    const viewportOffset = this.viewport.height / 2;
    this.isBefore = this.plane.position.y + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.y - planeOffset > viewportOffset;
    
    if (direction === 'down' && this.isAfter) {
      this.extra -= this.heightTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'up' && this.isBefore) {
      this.extra += this.heightTotal;
      this.isBefore = this.isAfter = false;
    }
  }

  onResize({ screen, viewport }: any = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.plane.scale.x = this.viewport.width * 0.62;
    this.plane.scale.y = this.plane.scale.x * 0.76;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = this.plane.scale.y * 0.78;
    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.length;
    this.y = this.height * this.index;
  }
}

class WebGlGallery {
  container: HTMLDivElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position?: number };
  onActiveIndexChange: (idx: number) => void;
  renderer!: Renderer;
  gl: any;
  scene!: Transform;
  camera!: Camera;
  geometry!: Plane;
  medias!: Media[];
  screen: any;
  viewport: any;
  isDown: boolean = false;
  start: number = 0;
  autoScrollTimer: any;
  animationFrame!: number;

  constructor(
    container: HTMLDivElement,
    { items, bend, textColor, borderRadius, font, scrollSpeed = 2.0, scrollEase = 0.06, onActiveIndexChange }: any
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onActiveIndexChange = onActiveIndexChange;
    
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
    this.startAutoScroll();
  }

  startAutoScroll() {
    this.autoScrollTimer = setInterval(() => {
      if (this.isDown) return;
      if (!this.medias || !this.medias[0]) return;
      
      const height = this.medias[0].height;
      const nextTarget = this.scroll.target - height;
      
      gsap.to(this.scroll, {
        target: nextTarget,
        current: nextTarget,
        duration: 1.2,
        ease: 'power3.inOut'
      });
    }, 4500);
  }

  stopAutoScroll() {
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
    }
  }

  resetAutoScroll() {
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  createScene() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas);
    this.scene = new Transform();
    this.camera = new Camera(this.gl);
    this.camera.position.z = 5;
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, { widthSegments: 20, heightSegments: 20 });
  }

  createMedias(items: any[], bend: number, textColor: string, borderRadius: number, font: string) {
    this.medias = items.map((item, index) => new Media({
      geometry: this.geometry,
      gl: this.gl,
      image: item.image,
      index,
      length: items.length,
      renderer: this.renderer,
      scene: this.scene,
      screen: this.screen,
      text: item.text,
      viewport: this.viewport,
      bend,
      textColor,
      borderRadius,
      font
    }));
  }

  updateLanguageFont(lang: 'en' | 'am') {
    const t = TRANSLATIONS[lang];
    const font = lang === 'am' ? '28px nokia-bold' : 'bold 28px "PP Neue Montreal", sans-serif';
    this.medias.forEach((media, index) => {
      const label = t.gallery[index].text;
      media.title.updateText(label, font);
    });
  }

  onTouchDown(e: any) {
    this.isDown = true;
    gsap.killTweensOf(this.scroll);
    this.stopAutoScroll();
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientY : e.clientY;
  }

  onTouchMove(e: any) {
    if (!this.isDown) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const distance = (this.start - y) * 2;
    this.scroll.target = (this.scroll.position || 0) - distance * this.scrollSpeed;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
    this.resetAutoScroll();
  }

  onWheel(e: any) {
    gsap.killTweensOf(this.scroll);
    this.stopAutoScroll();
    const delta = e.deltaY || e.wheelDelta || e.detail || 0;
    this.scroll.target += (delta > 0 ? -this.scrollSpeed : this.scrollSpeed) * 0.45;
    this.onCheck();
    this.resetAutoScroll();
  }

  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const height = this.medias[0].height;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / height);
    const item = height * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };

    const oldHeight = this.medias && this.medias[0] ? this.medias[0].height : 0;

    if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
      
      const newHeight = this.medias[0].height;
      if (oldHeight > 0 && newHeight > 0 && oldHeight !== newHeight) {
        const ratio = newHeight / oldHeight;
        this.scroll.target *= ratio;
        this.scroll.current *= ratio;
        this.scroll.last *= ratio;
        this.medias.forEach(media => { media.extra *= ratio; });
      }
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'down' : 'up';
    
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
      
      let closestMedia = this.medias[0];
      let minDistance = Infinity;
      this.medias.forEach(media => {
        const dist = Math.abs(media.plane.position.y);
        if (dist < minDistance) {
          minDistance = dist;
          closestMedia = media;
        }
      });

      const index = closestMedia.index;
      if (this.onActiveIndexChange) {
        this.onActiveIndexChange(index);
      }
    }

    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.animationFrame = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.onResize = this.onResize.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchUp = this.onTouchUp.bind(this);
    this.onWheel = this.onWheel.bind(this);

    window.addEventListener('resize', this.onResize);
    
    this.container.addEventListener('mousedown', this.onTouchDown);
    this.container.addEventListener('mousemove', this.onTouchMove);
    window.addEventListener('mouseup', this.onTouchUp);

    this.container.addEventListener('touchstart', this.onTouchDown, { passive: true });
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchUp);

    this.container.addEventListener('wheel', this.onWheel, { passive: true });
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mouseup', this.onTouchUp);
    window.removeEventListener('touchend', this.onTouchUp);
    
    if (this.container) {
      this.container.removeEventListener('mousedown', this.onTouchDown);
      this.container.removeEventListener('mousemove', this.onTouchMove);
      this.container.removeEventListener('touchstart', this.onTouchDown);
      this.container.removeEventListener('touchmove', this.onTouchMove);
      this.container.removeEventListener('wheel', this.onWheel);
      
      if (this.gl && this.gl.canvas && this.container.contains(this.gl.canvas)) {
        this.container.removeChild(this.gl.canvas);
      }
    }
    
    this.stopAutoScroll();
    window.cancelAnimationFrame(this.animationFrame);
  }
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

export default function HeroGallery() {
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const cardNavRef = useRef<HTMLElement>(null);
  const cardNavContentRef = useRef<HTMLDivElement>(null);
  const appRootRef = useRef<HTMLDivElement>(null);

  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'am'>('en');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [currentBgImage, setCurrentBgImage] = useState<string>('');
  const [nextBgImage, setNextBgImage] = useState<string>('');
  const [bgCurrentOpacity, setBgCurrentOpacity] = useState(0);
  const [bgNextOpacity, setBgNextOpacity] = useState(0);

  const galleryInstanceRef = useRef<WebGlGallery | null>(null);
  const textUpdateTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Synchronize dynamic backgrounds on index change
  useEffect(() => {
    const t = TRANSLATIONS[currentLanguage];
    const activeItem = t.gallery[activeIndex];

    if (activeItem.bgImage) {
      const nextBg = activeItem.bgImage;
      if (bgCurrentOpacity === 0) {
        setCurrentBgImage(nextBg);
        setBgCurrentOpacity(1);
        setBgNextOpacity(0);
      } else {
        setNextBgImage(nextBg);
        setBgNextOpacity(1);
        setBgCurrentOpacity(0);
        // Switch layers back after transition
        const timer = setTimeout(() => {
          setCurrentBgImage(nextBg);
          setBgCurrentOpacity(1);
          setBgNextOpacity(0);
        }, 700);
        return () => clearTimeout(timer);
      }
    } else {
      setBgCurrentOpacity(0);
      setBgNextOpacity(0);
    }
  }, [activeIndex, currentLanguage]);

  // Handle active slide changed from WebGL trigger
  const handleActiveIndexChange = (index: number) => {
    // WebGL loops infinitely so normalize bounds
    const totalItems = TRANSLATIONS[currentLanguage].gallery.length;
    const normalizedIndex = ((index % totalItems) + totalItems) % totalItems;
    
    setActiveIndex((prev) => {
      if (prev === normalizedIndex) return prev;
      
      // Animate text transition
      const t = TRANSLATIONS[currentLanguage];
      const displayItem = t.gallery[normalizedIndex];
      const titleEl = document.getElementById('hero-title');
      const descEl = document.getElementById('hero-desc');

      if (titleEl && descEl) {
        gsap.to([titleEl, descEl], {
          y: '-100%',
          duration: 0.35,
          stagger: 0.04,
          ease: 'power3.in',
          onComplete: () => {
            titleEl.textContent = displayItem.text;
            descEl.textContent = displayItem.description;

            gsap.fromTo([titleEl, descEl], 
              { y: '100%' },
              { y: '0%', duration: 0.55, stagger: 0.08, ease: 'power3.out' }
            );
          }
        });
      }
      return normalizedIndex;
    });
  };

  // Initialize WebGL Circular Gallery
  useEffect(() => {
    const container = galleryContainerRef.current;
    if (!container) return;

    const items = TRANSLATIONS.en.gallery;
    
    const gallery = new WebGlGallery(container, {
      items,
      bend: -2.8,
      textColor: '#d4af37',
      borderRadius: 0.08,
      scrollSpeed: 1.8,
      scrollEase: 0.06,
      onActiveIndexChange: handleActiveIndexChange
    });

    galleryInstanceRef.current = gallery;

    // Trigger initial reveal animation
    const titleEl = document.getElementById('hero-title');
    const descEl = document.getElementById('hero-desc');
    if (titleEl && descEl) {
      gsap.fromTo([titleEl, descEl],
        { y: '100%' },
        { y: '0%', duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.4 }
      );
    }

    return () => {
      if (galleryInstanceRef.current) {
        galleryInstanceRef.current.destroy();
      }
    };
  }, []);

  // Update text elements and WebGL titles on language toggle
  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'en' ? 'am' : 'en';
    setCurrentLanguage(nextLang);

    // Dynamic Title texture re-generation inside canvas
    if (galleryInstanceRef.current) {
      galleryInstanceRef.current.updateLanguageFont(nextLang);
    }

    // Dynamic reveal text translate trigger
    const t = TRANSLATIONS[nextLang];
    const displayItem = t.gallery[activeIndex];
    const titleEl = document.getElementById('hero-title');
    const descEl = document.getElementById('hero-desc');

    if (titleEl && descEl) {
      gsap.to([titleEl, descEl], {
        y: '-100%',
        duration: 0.3,
        stagger: 0.04,
        ease: 'power3.in',
        onComplete: () => {
          titleEl.textContent = displayItem.text;
          descEl.textContent = displayItem.description;

          gsap.fromTo([titleEl, descEl], 
            { y: '100%' },
            { y: '0%', duration: 0.6, stagger: 0.08, ease: 'power3.out' }
          );
        }
      });
    }
  };

  // Expanded card navigation animation
  const calculateNavHeight = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      const content = cardNavContentRef.current;
      if (!content) return 60;
      return 60 + content.scrollHeight + 16;
    }
    return 260;
  };

  const toggleNav = () => {
    const cardNav = cardNavRef.current;
    if (!cardNav) return;

    if (!isNavExpanded) {
      setIsNavExpanded(true);
      gsap.to(cardNav, {
        height: calculateNavHeight(),
        duration: 0.45,
        ease: 'power3.out'
      });
      gsap.fromTo('.nav-card', 
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.06 }
      );
    } else {
      setIsNavExpanded(false);
      gsap.to(cardNav, {
        height: 60,
        duration: 0.4,
        ease: 'power3.inOut'
      });
    }
  };

  // Elegant scroll helper to smoothly focus catalog sections
  const scrollToSection = (targetId: string) => {
    setIsNavExpanded(false);
    const cardNav = cardNavRef.current;
    if (cardNav) {
      gsap.to(cardNav, { height: 60, duration: 0.3 });
    }

    setTimeout(() => {
      let target: HTMLElement | null = null;
      if (targetId === 'catalog') {
        target = document.querySelector('section:nth-of-type(1)'); // Collection section
      } else if (targetId === 'heritage') {
        target = document.querySelector('section:nth-of-type(2)'); // Heritage section
      } else if (targetId === 'showroom') {
        target = document.querySelector('section:nth-of-type(3)'); // Showroom location
      }

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const t = TRANSLATIONS[currentLanguage];
  const activeItem = t.gallery[activeIndex];

  return (
    <div 
      ref={appRootRef}
      className="w-full min-h-screen flex flex-col md:flex-row items-center justify-between overflow-hidden relative transition-colors duration-1000 z-30"
      style={{ backgroundColor: activeItem.color }}
    >
      {/* Background Image Layer (Active BG with Blur) */}
      <div className="absolute inset-0 w-full h-full z-0 transition-all duration-1000 pointer-events-none">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 blur-3xl scale-110"
          style={{ 
            backgroundImage: currentBgImage ? `url(${currentBgImage})` : 'none',
            opacity: bgCurrentOpacity * 0.28
          }}
        />
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 blur-3xl scale-110"
          style={{ 
            backgroundImage: nextBgImage ? `url(${nextBgImage})` : 'none',
            opacity: bgNextOpacity * 0.28
          }}
        />
      </div>

      {/* Card Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2 w-[92%] max-w-[850px] z-[99] top-[1.2em] md:top-[2.2em]">
        <nav 
          ref={cardNavRef}
          className="block h-[60px] p-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden will-change-[height] bg-white/95 backdrop-blur-md border border-[#4a3525]/10"
        >
          {/* Top Bar */}
          <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between px-5 z-[2]">
            {/* Mobile Language Globe + Hamburger */}
            <div className="flex items-center gap-4 order-2 md:order-none h-full">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex md:hidden items-center justify-center h-full border-0 bg-transparent cursor-pointer transition-opacity duration-300 hover:opacity-70 text-[#121110]"
                aria-label="Toggle Language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe text-[#8b5a2b]"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </button>
              
              <button
                onClick={toggleNav}
                className="group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px] text-[#121110] bg-transparent border-none outline-none"
                aria-label="Toggle Navigation Menu"
              >
                <div className={`w-[26px] h-[2px] bg-[#121110] transition-all duration-300 ease-linear ${isNavExpanded ? 'translate-y-[4px] rotate-45' : ''}`}></div>
                <div className={`w-[26px] h-[2px] bg-[#121110] transition-all duration-300 ease-linear ${isNavExpanded ? '-translate-y-[4px] -rotate-45' : ''}`}></div>
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 order-1 md:order-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img 
                src="https://andegnafurniture.com/wp-content/uploads/2022/07/logo-final-300x169.png.webp" 
                alt="Andegna Furniture Logo" 
                className="h-[30px] w-auto object-contain brightness-0 filter" 
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Desktop Language Toggle + CTA */}
            <div className="hidden md:flex items-center gap-4 h-full">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center w-10 h-full border-0 bg-transparent cursor-pointer transition-transform duration-300 hover:scale-105 text-[#121110]"
                aria-label="Toggle Language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe text-[#8b5a2b]"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                <span className="text-[10px] uppercase font-mono tracking-wider ml-1 text-[#8b5a2b] font-bold">{currentLanguage === 'en' ? 'EN' : 'አማ'}</span>
              </button>
              
              <button
                onClick={() => scrollToSection('catalog')}
                className="border-0 rounded-xl px-5 flex items-center justify-center h-[40px] text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all duration-300 bg-[#121110] text-[#d4af37] hover:bg-[#1a1410] font-mono hover:scale-[1.03]"
              >
                {t.nav.cta}
              </button>
            </div>
          </div>

          {/* Cards Nav Content */}
          <div
            ref={cardNavContentRef}
            className={`absolute left-0 right-0 top-[60px] bottom-0 p-3 flex flex-col items-stretch gap-3 justify-start z-[1] transition-all duration-300 ${
              isNavExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            } md:flex-row md:items-end md:gap-[12px]`}
            aria-hidden={!isNavExpanded}
          >
            {/* Card 1 - About */}
            <div className="nav-card select-none relative flex flex-col justify-between p-[18px_20px] rounded-xl flex-[1_1_auto] h-auto min-h-[90px] md:h-full md:min-h-0 md:flex-[1_1_0%] bg-[#1c1510] text-white border border-[#d4af37]/15">
              <div className={`nav-card-label font-normal tracking-tight text-[18px] md:text-[22px] text-[#d4af37] ${currentLanguage === 'am' ? 'font-amharic-bold' : 'font-sans'}`}>
                {t.nav.title1}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[4px] pt-4 md:pt-0">
                <button 
                  onClick={() => scrollToSection('heritage')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link1}</span>
                </button>
                <button 
                  onClick={() => scrollToSection('heritage')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link2}</span>
                </button>
              </div>
            </div>

            {/* Card 2 - Products */}
            <div className="nav-card select-none relative flex flex-col justify-between p-[18px_20px] rounded-xl flex-[1_1_auto] h-auto min-h-[90px] md:h-full md:min-h-0 md:flex-[1_1_0%] bg-[#1a1410] text-white border border-[#d4af37]/15">
              <div className={`nav-card-label font-normal tracking-tight text-[18px] md:text-[22px] text-[#d4af37] ${currentLanguage === 'am' ? 'font-amharic-bold' : 'font-sans'}`}>
                {t.nav.title2}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[4px] pt-4 md:pt-0">
                <button 
                  onClick={() => scrollToSection('catalog')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link3}</span>
                </button>
                <button 
                  onClick={() => scrollToSection('catalog')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link4}</span>
                </button>
              </div>
            </div>

            {/* Card 3 - Contact */}
            <div className="nav-card select-none relative flex flex-col justify-between p-[18px_20px] rounded-xl flex-[1_1_auto] h-auto min-h-[110px] md:h-full md:min-h-0 md:flex-[1_1_0%] bg-[#121110] text-white border border-[#d4af37]/20">
              <div className={`nav-card-label font-normal tracking-tight text-[18px] md:text-[22px] text-[#d4af37] ${currentLanguage === 'am' ? 'font-amharic-bold' : 'font-sans'}`}>
                {t.nav.title3}
              </div>
              <div className="nav-card-links mt-auto flex flex-col gap-[4px] pt-4 md:pt-0">
                <button 
                  onClick={() => scrollToSection('showroom')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link5}</span>
                </button>
                <button 
                  onClick={() => scrollToSection('showroom')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link6}</span>
                </button>
                <button 
                  onClick={() => scrollToSection('showroom')}
                  className="nav-card-link inline-flex items-center gap-[6px] no-underline bg-transparent border-0 p-0 text-left cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[14px] md:text-[15px] text-white/80 font-mono"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right shrink-0 text-[#d4af37]"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  <span>{t.nav.link7}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Left Text Content (Hero Header & Description) */}
      <div className="flex-1 flex flex-col items-start justify-center text-white p-8 md:p-16 z-10 relative">
        <div className="max-w-xl md:max-w-3xl mt-24 md:mt-0 flex flex-col gap-6">
          <div className="overflow-hidden">
            <h1 
              id="hero-title" 
              className={`reveal-text text-4xl md:text-[6.8rem] md:leading-[1.05] tracking-tight m-0 transform translate-y-[100%] ${
                currentLanguage === 'am' ? 'font-amharic-bold font-light' : 'font-bold font-sans'
              }`}
            >
              {activeItem.text}
            </h1>
          </div>
          <div className="overflow-hidden">
            <p 
              id="hero-desc" 
              className={`reveal-text text-base md:text-[2.2rem] md:leading-[1.3] text-white/80 m-0 transform translate-y-[100%] ${
                currentLanguage === 'am' ? 'font-amharic-light' : 'font-light'
              }`}
            >
              {activeItem.description}
            </p>
          </div>

          <div className="mt-4 flex gap-4 overflow-hidden">
            <button 
              onClick={() => scrollToSection('catalog')}
              className="rounded-full bg-[#d4af37] text-[#121110] border border-[#b8952d] px-8 py-3.5 text-xs font-mono font-bold tracking-widest uppercase hover:bg-[#cfa253] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-black/15"
            >
              {currentLanguage === 'en' ? 'Customize Furniture' : 'ዕቃ ማስተካከል'}
            </button>
            
            <button 
              onClick={() => scrollToSection('showroom')}
              className="rounded-full border border-white/20 hover:border-white px-8 py-3.5 text-xs font-mono tracking-widest uppercase hover:bg-white/5 active:scale-95 transition-all duration-300"
            >
              {currentLanguage === 'en' ? 'Our Showroom' : 'ሳሎናችንን ይጎብኙ'}
            </button>
          </div>
        </div>
      </div>

      {/* Right WebGL Gallery Container */}
      <div 
        ref={galleryContainerRef} 
        className="w-full md:w-[480px] lg:w-[580px] h-[55vh] md:h-screen relative shrink-0 z-10 select-none cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
