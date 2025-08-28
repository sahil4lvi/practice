// src/components/productcardmodern.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ProductCardModern({ products }) {   // ✅ accept products as props
  return (
    <>
      <GlobalStyles />
      <div style={{ background: '#fcfcfd', minHeight: '100svh' }}>
        <GridWithZoom products={products} />  {/* ✅ use props */}
      </div>
    </>
  );
}



/* ---------- Global Styles ---------- */
function GlobalStyles() {
  return (
    <style>{`
      /* CSS Reset & Box Sizing */
      *, *::before, *::after { box-sizing: border-box; }
      * { margin: 0; padding: 0; }
      
      /* Document & Root Elements */
      html { 
        height: 100%; 
        /* Improved font rendering */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* Smooth scrolling for users who don't prefer reduced motion */
        scroll-behavior: smooth;
      }
      body, #root { 
        min-height: 100%; 
        isolation: isolate; /* Creates new stacking context */
      }
      
      /* Body Styles */
      body { 
        font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; 
        color: #0b0c10; 
        background: #fcfcfd; 
        line-height: 1.5;
        text-rendering: optimizeSpeed;
      }
      
      /* Media Elements */
      img, picture, video, canvas, svg { 
        display: block; 
        max-width: 100%; 
      }
      
      /* Form Elements */
      input, button, textarea, select { 
        font: inherit; 
        border: none;
        background: transparent;
      }
      
      /* Interactive Elements */
      button {
        cursor: pointer;
        border: none;
        background: transparent;
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
      
      /* Focus Styles with Fallback */
      :focus-visible { 
        outline: 3px solid rgba(14, 95, 255, 0.5); 
        outline-offset: 2px; 
        border-radius: 4px; 
      }
      /* Fallback for browsers that don't support focus-visible */
      :focus:not(:focus-visible) {
        outline: none;
      }
      
      /* Typography Improvements */
      h1, h2, h3, h4, h5, h6 {
        line-height: 1.2;
        overflow-wrap: break-word;
      }
      p {
        overflow-wrap: break-word;
      }
      
      /* Reduced Motion for Accessibility */
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      
      /* Remove list styles */
      ul[role='list'], ol[role='list'] {
        list-style: none;
      }
      
      /* Ensure responsive text sizing */
      html {
        font-size: 100%; /* 16px by default */
      }
      
      /* Improve readability with max-width on text containers */
      .text-container {
        max-width: 65ch;
      }
    `}</style>
  );
}

/* ---------- Grid with Zoom Modal ---------- */
function GridWithZoom({ products }) {
  const [openProduct, setOpenProduct] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = (product, el) => {
    const rect = el.getBoundingClientRect();
    // Include scroll offset so it animates from correct screen position
    setAnchorRect({
      left: rect.left,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
    setOpenProduct(product);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setOpenProduct(null);
      setAnchorRect(null);
      setIsClosing(false);
    }, 450); // Match the animation duration
  };

  return (
    <>
      <style>{`
        .grid-shell { width: min(1220px, 100%); margin: 0 auto; padding: 32px 20px 80px; }
        .grid-title { font-size: 22px; font-weight: 700; letter-spacing: .2px; margin-bottom: 16px; color: #0b0c10; }
        .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
        @media (max-width: 1100px) { .grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 780px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

        .card {
          background: #fff; border: 1px solid #eef1f5; border-radius: 16px; overflow: hidden;
          box-shadow: 0 6px 18px rgba(17,24,39,0.06); cursor: pointer;
          transition: transform .18s ease, box-shadow .2s ease;
        }
        .card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(17,24,39,0.08); }
        .card-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; background: #f7f8fb; }
        .card-body { padding: 12px 12px 14px; display: grid; gap: 4px; }
        .card-brand { font-size: 11px; color: #6b7280; letter-spacing: .18em; text-transform: uppercase; }
        .card-title { font-size: 15px; font-weight: 700; color: #0b0c10; }
        .card-price { font-size: 14px; color: #374151; }
      `}</style>

      <div className="grid-shell">
        <div className="grid-title">Featured</div>
        <div className="grid">
          {products.map((p) => (
            <GridCard key={p.id} product={p} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      <ZoomModal 
        anchorRect={anchorRect} 
        isOpen={!!openProduct} 
        isClosing={isClosing}
        onClose={handleClose}
      >
        {openProduct ? (
          <LuxeWhiteProductPage
            brand={openProduct.brand}
            title={openProduct.title}
            description={openProduct.description}
            price={openProduct.price}
            currency={openProduct.currency || '$'}
            note={openProduct.note}
            topShippingText={openProduct.topShippingText}
            tinyInfo={openProduct.tinyInfo}
            colorVariants={openProduct.colorVariants}
            perks={openProduct.perks}
            onAddToCart={(payload) => console.log('Add to cart', payload)}
            onSave={(payload) => console.log('Saved', payload)}
            onClose={handleClose}
          />
        ) : null}
      </ZoomModal>
    </>
  );
}

function GridCard({ product, onOpen }) {
  const ref = useRef(null);
  return (
    <div
      className="card"
      ref={ref}
      onClick={() => ref.current && onOpen(product, ref.current)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') ref.current && onOpen(product, ref.current); }}
      aria-label={`${product.title} - view details`}
    >
      <img className="card-img" src={product.cover} alt={product.title} />
      <div className="card-body">
        <div className="card-brand">{product.brand}</div>
        <div className="card-title">{product.title}</div>
        <div className="card-price">{(product.currency || '$')}{product.price}</div>
      </div>
    </div>
  );
}

/* ---------- Zoom Modal ---------- */
function ZoomModal({ anchorRect, isOpen, isClosing, onClose, children }) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef(null);
  const [portalEl, setPortalEl] = useState(null);

  useEffect(() => {
    let el = document.getElementById('zoom-portal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'zoom-portal-root';
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const card = modalRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const start = anchorRect || { left: vw/2 - 150, top: vh/2 - 150, width: 300, height: 300 };
    card.style.setProperty('--start-left', `${start.left}px`);
    card.style.setProperty('--start-top', `${start.top}px`);
    card.style.setProperty('--start-width', `${start.width}px`);
    card.style.setProperty('--start-height', `${start.height}px`);
    requestAnimationFrame(() => setMounted(true));
  }, [isOpen, anchorRect]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!portalEl || !isOpen) return null;

  return createPortal(
    <>
      <style>{`.zoom-overlay {
  position: fixed; inset: 0;
  background: rgba(10, 15, 25, 0.55);
  backdrop-filter: blur(6px);
  transform: scale(1.01);
  opacity: 0;
  transition:
    opacity .35s cubic-bezier(.4,0,.2,1),
    transform .35s cubic-bezier(.4,0,.2,1);
  z-index: 1000;
}
.zoom-overlay.in {
  opacity: 1;
  transform: scale(1);
}
.zoom-overlay.closing {
  opacity: 0;
  transform: scale(1.01);
}

.zoom-shell {
  position: fixed; inset: 0;
  z-index: 1001;
  pointer-events: none;
}

.zoom-card {
  position: absolute;
  left: var(--start-left);
  top: var(--start-top);
  width: var(--start-width);
  height: var(--start-height);
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(0,0,0,0.22);
  transform-origin: center center;
  transform: scale(0.95) translateY(16px);
  opacity: 0.85;
  transition:
    left .4s cubic-bezier(.4,0,.2,1),
    top .4s cubic-bezier(.4,0,.2,1),
    width .4s cubic-bezier(.4,0,.2,1),
    height .4s cubic-bezier(.4,0,.2,1),
    border-radius .35s ease,
    box-shadow .35s ease,
    transform .4s cubic-bezier(.4,0,.2,1),
    opacity .3s ease;
  pointer-events: all;
  display: grid;
}
.zoom-card.in {
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  transform: scale(1) translateY(0);
  opacity: 1;
}
.zoom-card.closing {
  left: var(--start-left);
  top: var(--start-top);
  width: var(--start-width);
  height: var(--start-height);
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.22);
  transform: scale(0.95) translateY(16px);
  opacity: 0.8;
}

.zoom-content {
  width: 100%; height: 100%;
  overflow: auto;
  background: #fcfcfd;
  animation: fadeSlideIn .35s ease forwards;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.zoom-close {
  position: fixed;
  top: 16px; right: 18px;
  z-index: 2;
  background: rgba(255,255,255,0.95);
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 10px 12px;
  box-shadow: 0 8px 18px rgba(0,0,0,0.15);
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: transform .25s ease, opacity .25s ease, box-shadow .25s ease;
}
.zoom-close:hover { transform: scale(1.08); }
.zoom-close:active { transform: scale(0.92); }
.zoom-close.closing { opacity: 0; }
`}</style>

      <div className={`zoom-overlay ${mounted && !isClosing ? 'in' : ''} ${isClosing ? 'closing' : ''}`} onClick={onClose} />

      <div className="zoom-shell">
        <div className={`zoom-card ${mounted && !isClosing ? 'in' : ''} ${isClosing ? 'closing' : ''}`} ref={modalRef}>
          <button className={`zoom-close ${isClosing ? 'closing' : ''}`} type="button" onClick={onClose} aria-label="Close">✕</button>
          <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </>,
    portalEl
  );
}

/* ---------- Luxe White Product Page (inline) ---------- */
function LuxeWhiteProductPage({
  brand = 'ZENZ',
  title = 'The Wave Tee',
  description = 'Crafted from premium Japanese cotton with a subtle sheen that catches the light. Featuring our signature wave embroidery in 24k gold thread, this piece embodies understated luxury.',
  price = 180,
  currency = '$',
  note = 'Complimentary worldwide shipping over $200',
  topShippingText = 'Complimentary gift wrapping on all orders.',
  tinyInfo = 'Dispatched within 24–48 hours. 30‑day returns.',
  colorVariants = [
    {
      key: 'white',
      label: 'Ivory',
      accent: '#0E5FFF',
      hero: '/images/wave-tee/ivory-hero.jpg',
      thumbnails: [
        '/images/wave-tee/ivory-front.jpg',
        '/images/wave-tee/ivory-back.jpg',
        '/images/wave-tee/ivory-detail.jpg',
        '/images/wave-tee/ivory-lifestyle.jpg',
      ],
    },
    {
      key: 'black',
      label: 'Onyx',
      accent: '#1E3A8A',
      hero: '/images/wave-tee/black-hero.jpg',
      thumbnails: [
        '/images/wave-tee/black-front.jpg',
        '/images/wave-tee/black-back.jpg',
        '/images/wave-tee/black-detail.jpg',
        '/images/wave-tee/black-lifestyle.jpg',
      ],
    },
  ],
  perks = ['Japanese Cotton', '24k Gold Embroidery', 'Tailored Fit', 'Gift Wrapped'],
  id = 'wave-tee',
  skuBase = 'WT',
  defaultQty = 1,
  onAddToCart,
  onSave,
  onClose,
}) {
  const [qty, setQty] = useState(defaultQty);
  const [added, setAdded] = useState(false);
  const [activeColorKey, setActiveColorKey] = useState(colorVariants?.[0]?.key || '');
  const [activeIdx, setActiveIdx] = useState(0);
  const cardRef = useRef(null);

  const currentColor = useMemo(
    () => colorVariants.find((c) => c.key === activeColorKey) || colorVariants?.[0] || null,
    [activeColorKey, colorVariants]
  );

  const gallery = useMemo(() => {
    if (!currentColor) return [];
    const thumbs = currentColor.thumbnails || [];
    const hero = currentColor.hero ? [currentColor.hero] : [];
    return [...hero, ...thumbs].filter(Boolean).slice(0, 6);
  }, [currentColor]);

  useEffect(() => {
    if (!currentColor) return;
    const root = document.documentElement;
    root.style.setProperty('--accent', currentColor.accent || '#0E5FFF');
    setActiveIdx(0);
  }, [currentColor]);

  // Hide scrollbar and make page full screen
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Instead, always trigger animation on mount:
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (el) {
      el.classList.remove('in');
      // Force reflow to restart animation
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;
      requestAnimationFrame(() => el.classList.add('in'));
    }
  }, [title, activeColorKey]);

  const handleParallax = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const moveX = (x - 0.5) * 6;
    const moveY = (y - 0.5) * 6;
    e.currentTarget.style.setProperty('--tiltX', `${-moveY}deg`);
    e.currentTarget.style.setProperty('--tiltY', `${moveX}deg`);
    e.currentTarget.style.setProperty('--shiftX', `${moveX * 0.2}px`);
    e.currentTarget.style.setProperty('--shiftY', `${moveY * 0.2}px`);
  };
  const resetParallax = (e) => {
    e.currentTarget.style.setProperty('--tiltX', `0deg`);
    e.currentTarget.style.setProperty('--tiltY', `0deg`);
    e.currentTarget.style.setProperty('--shiftX', `0px`);
    e.currentTarget.style.setProperty('--shiftY', `0px`);
  };

  const handleAddToCart = () => {
    const payload = {
      id,
      sku: `${skuBase}-${activeColorKey}`.toUpperCase(),
      title: `${title} – ${currentColor?.label || ''}`,
      price,
      currency,
      qty,
      color: activeColorKey,
      image: gallery[activeIdx] || '',
    };
    onAddToCart?.(payload);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleSave = () => {
    const payload = {
      id,
      sku: `${skuBase}-${activeColorKey}`.toUpperCase(),
      title: `${title} – ${currentColor?.label || ''}`,
      price,
      currency,
      color: activeColorKey,
    };
    onSave?.(payload);
  };

  return (
    <>
      <style>{`
        /* Hide scrollbar for all browsers */
        body, html {
          overflow: hidden !important;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        
        /* Hide scrollbar for WebKit browsers */
        ::-webkit-scrollbar {
          display: none;
        }
        
        :root {
          --page-bg: ; 
          --ink: #0b0c10; 
          --muted: #6b7280; 
          --divider: #e8eaf0; 
          --panel: #ffffff;
          --elev: rgba(17, 24, 39, 0.06); 
          --accent: #0E5FFF; 
          --gold: #b7892e; 
          --gold-2: #e8c978; 
        }

        /* Full screen page */
        .page {
          height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          color: var(--ink);
          position: fixed;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .shell { 
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .card {
          display: grid; 
          grid-template-columns: 1.15fr 1fr; 
          gap: 48px; 
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 0;
          border: 1px solid rgba(243, 244, 247, 0.7); 
          padding: 40px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05);
          transform: translateY(16px); 
          opacity: 0; 
          transition: 
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
            opacity 0.8s ease,
            box-shadow 0.4s ease,
            backdrop-filter 0.4s ease;
          width: 100%;
          height: 100%;
          border-radius: 0;
          overflow-y: auto;
        }

        .card.in { 
          transform: translateY(0); 
          opacity: 1; 
        }

        .card:hover {
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(24px);
        }

        @media (max-width: 1080px) { 
          .card { 
            grid-template-columns: 1fr; 
            gap: 32px; 
            padding: 24px; 
          } 
        }

        @media (max-width: 768px) { 
          .card { 
            padding: 16px; 
          } 
        }

        .gallery { 
          border-radius: 20px; 
          padding: 16px; 
          background: rgba(255, 255, 255, 0.6); 
          backdrop-filter: blur(12px);
          border: 1px solid rgba(241, 243, 247, 0.7); 
          animation: galleryReveal 0.6s ease-out 0.3s both;
        }

        @keyframes galleryReveal {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero {
          position: relative; 
          border-radius: 18px; 
          overflow: hidden; 
          perspective: 1200px; 
          transform-style: preserve-3d;
          --tiltX: 0deg; 
          --tiltY: 0deg; 
          --shiftX: 0px; 
          --shiftY: 0px;
          transition: 
            box-shadow 0.4s ease, 
            transform 0.24s ease;
          box-shadow: 0 10px 28px rgba(17, 24, 39, 0.08);
          background: radial-gradient(140% 100% at 50% 0%, rgba(255, 255, 255, 0.8) 0%, rgba(247, 248, 251, 0.7) 70%), #fff;
          animation: heroFloat 12s ease-in-out infinite;
        }

        @keyframes heroFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .hero-inner { 
          transform: rotateX(var(--tiltX)) rotateY(var(--tiltY)) translate(var(--shiftX), var(--shiftY)); 
          transform-style: preserve-3d; 
          transition: transform 0.1s ease-out; 
        }

        .hero-img { 
          width: 100%; 
          aspect-ratio: 4/3; 
          object-fit: cover; 
          background: linear-gradient(0deg, #f7f8fb, #ffffff); 
        }

        .halo {
          content: ''; 
          position: absolute; 
          inset: -2px; 
          border-radius: 20px;
          background: radial-gradient(55% 40% at 50% -10%, color-mix(in oklab, var(--accent) 18%, transparent) 0%, transparent 70%);
          filter: blur(24px); 
          opacity: .4; 
          z-index: 0;
          animation: haloPulse 8s ease-in-out infinite;
        }

        @keyframes haloPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.02);
          }
        }

        .badge {
          position: absolute; 
          top: 16px; 
          left: 16px; 
          padding: 7px 12px; 
          border-radius: 999px;
          background: linear-gradient(135deg, var(--gold), var(--gold-2), var(--gold));
          color: #2a1b00; 
          font-weight: 700; 
          letter-spacing: .2px; 
          font-size: 11.5px;
          box-shadow: 
            inset 0 1px 0 rgba(255, 255, 255, 0.6), 
            0 8px 18px rgba(183, 137, 46, 0.2);
          transform: translateZ(50px);
          animation: badgeShine 3s ease-in-out infinite;
        }

        @keyframes badgeShine {
          0%, 100% {
            background: linear-gradient(135deg, var(--gold), var(--gold-2), var(--gold));
          }
          50% {
            background: linear-gradient(135deg, var(--gold-2), var(--gold), var(--gold-2));
          }
        }

        .thumbs { 
          display: grid; 
          grid-template-columns: repeat(6, 1fr); 
          gap: 10px; 
          margin-top: 12px; 
        }

        .thumb { 
          border-radius: 12px; 
          overflow: hidden; 
          aspect-ratio: 1/1; 
          background: #fff; 
          border: 1px solid #f1f3f7; 
          cursor: pointer; 
          transition: 
            transform 0.18s ease, 
            box-shadow 0.18s ease, 
            border-color 0.18s ease;
          box-shadow: 0 6px 14px rgba(17, 24, 39, 0.05);
        }

        .thumb.active { 
          border-color: var(--accent); 
          animation: thumbSelect 0.4s ease;
        }

        @keyframes thumbSelect {
          0% {
            transform: scale(0.95);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .thumb:hover { 
          transform: translateY(-4px) scale(1.03); 
          box-shadow: 0 12px 28px rgba(17, 24, 39, 0.12); 
        }

        .thumb img { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          display: block; 
          transition: transform 0.3s ease;
        }

        .thumb:hover img {
          transform: scale(1.1);
        }

        .content { 
          padding: 8px; 
          animation: contentReveal 0.6s ease-out 0.4s both;
        }

        @keyframes contentReveal {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .brand { 
          font-size: 12px; 
          letter-spacing: .32em; 
          text-transform: uppercase; 
          color: #111827; 
          opacity: .85; 
        }

        .title { 
          font-family: ui-serif, Georgia, 'Times New Roman', serif; 
          font-weight: 500; 
          font-size: clamp(34px, 4.6vw, 56px); 
          line-height: 1.06; 
          letter-spacing: .1px; 
          margin: 10px 0 8px; 
          animation: titleReveal 0.8s ease-out 0.5s both;
        }

        @keyframes titleReveal {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .subtitle { 
          color: #6b7280; 
          font-size: 16px; 
          line-height: 1.85; 
          max-width: 62ch; 
          animation: subtitleReveal 0.8s ease-out 0.6s both;
        }

        @keyframes subtitleReveal {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .divider { 
          height: 1px; 
          margin: 18px 0; 
          background: linear-gradient(90deg, transparent, #e8eaf0 20%, #e8eaf0 80%, transparent); 
        }

        .colorRow { 
          display: grid; 
          gap: 10px; 
          margin: 2px 0 8px; 
        }

        .colorLabel { 
          font-size: 13px; 
          color: #4b5563; 
        }

        .swatches { 
          display: flex; 
          gap: 12px; 
          flex-wrap: wrap; 
        }

        .swatch { 
          --size: 36px; 
          width: var(--size); 
          height: var(--size); 
          border-radius: 999px; 
          border: 2px solid #eef1f5; 
          box-shadow: 0 8px 20px rgba(17, 24, 39, 0.06); 
          cursor: pointer; 
          transition: 
            transform 0.12s ease, 
            border-color 0.2s ease, 
            box-shadow 0.2s ease;
        }

        .swatch:hover { 
          transform: translateY(-2px) scale(1.08); 
        }

        .swatch.active { 
          border-color: var(--accent); 
          box-shadow: 0 10px 24px rgba(17, 24, 39, 0.08);
          animation: swatchPulse 0.6s ease;
        }

        @keyframes swatchPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            transform: scale(1);
          }
        }

        .perkline { 
          display: flex; 
          flex-wrap: wrap; 
          gap: 10px 14px; 
          margin-top: 6px; 
        }

        .pill { 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          padding: 8px 12px; 
          border-radius: 999px; 
          background: #ffffff; 
          border: 1px solid #eef1f5; 
          color: #111827; 
          font-size: 13px; 
          box-shadow: 0 4px 10px rgba(17, 24, 39, 0.04);
          transition: 
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(17, 24, 39, 0.08);
        }

        .dot { 
          width: 7px; 
          height: 7px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, var(--gold), var(--gold-2));
          animation: dotPulse 2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .priceRow { 
          display: flex; 
          align-items: baseline; 
          gap: 12px; 
          margin-top: 10px; 
        }

        .price { 
          font-size: 28px; 
          font-weight: 800; 
          letter-spacing: 0.2px; 
        }

        .note { 
          color: #4b5563; 
          font-size: 13px; 
        }

        .controls { 
          display: flex; 
          gap: 12px; 
          align-items: center; 
          margin-top: 12px; 
          flex-wrap: wrap; 
        }

        .qty { 
          display: inline-flex; 
          align-items: center; 
          border-radius: 12px; 
          border: 1px solid #eef1f5; 
          background: #ffffff; 
          box-shadow: 0 6px 14px rgba(17, 24, 39, 0.04);
          transition: 
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .qty:hover {
          box-shadow: 0 8px 18px rgba(17, 24, 39, 0.08);
        }

        .qty button { 
          all: unset; 
          padding: 10px 14px; 
          cursor: pointer; 
          color: #111827; 
          transition: 
            background 0.15s ease, 
            transform 0.08s ease;
        }

        .qty button:hover { 
          background: #f6f7fb; 
        }

        .qty button:active { 
          transform: scale(0.98); 
        }

        .qty input { 
          all: unset; 
          width: 52px; 
          text-align: center; 
          padding: 10px 6px; 
          color: #111827; 
        }

        .cta { 
          appearance: none; 
          border: 0; 
          cursor: pointer; 
          border-radius: 14px; 
          padding: 12px 18px; 
          font-weight: 700; 
          color: #0b0c10; 
          background: linear-gradient(135deg, var(--gold-2), var(--gold)); 
          box-shadow: 0 16px 36px rgba(232, 201, 120, 0.22); 
          transition: 
            transform 0.12s ease, 
            box-shadow 0.2s ease, 
            filter 0.18s ease;
          position: relative;
          overflow: hidden;
        }

        .cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: 0.5s;
        }

        .cta:hover::before {
          left: 100%;
        }

        .cta:hover { 
          transform: translateY(-2px); 
          filter: saturate(1.08) brightness(1.05); 
          box-shadow: 0 20px 46px rgba(232, 201, 120, 0.28); 
        }

        .cta:active { 
          transform: translateY(0); 
        }

        .ghost { 
          all: unset; 
          cursor: pointer; 
          padding: 10px 14px; 
          border-radius: 12px; 
          border: 1px solid #eef1f5; 
          background: #ffffff; 
          color: #111827; 
          box-shadow: 0 6px 14px rgba(17, 24, 39, 0.04);
          transition: 
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .ghost:hover { 
          background: #f6f7fb; 
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(17, 24, 39, 0.08);
        }

        .tiny { 
          font-size: 12.5px; 
          color: #6b7280; 
          margin-top: 8px; 
        }

        .toast {
          position: fixed; 
          left: 50%; 
          bottom: 28px; 
          transform: translateX(-50%) translateY(20px);
          background: rgba(255, 255, 255, 0.9); 
          border: 1px solid #eef1f5; 
          color: #111827; 
          padding: 12px 16px; 
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(17, 24, 39, 0.12); 
          opacity: 0; 
          transition: 
            opacity 0.3s ease, 
            transform 0.3s ease;
          z-index: 10;
          backdrop-filter: blur(12px);
        }

        .toast.show { 
          opacity: 1; 
          transform: translateX(-50%) translateY(0); 
        }

        /* Add fade-in animation for all elements */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="page">
        <div className="shell">
          <section className="card" ref={cardRef} role="region" aria-label={`Product: ${title}`}>
            <div className="gallery">
              <div className="hero" onMouseMove={handleParallax} onMouseLeave={resetParallax} aria-label="Main product image">
                <div className="halo" aria-hidden="true" />
                <div className="hero-inner">
                  <div className="badge">24K Wave Embroidery</div>
                  {gallery.length > 0 ? (
                    <img className="hero-img" src={gallery[activeIdx]} alt={`${title} – ${currentColor?.label} ${activeIdx + 1}`} />
                  ) : (
                    <div className="hero-img" role="img" aria-label={`${title} visual`} />
                  )}
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="thumbs" aria-label="More angles">
                  {gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      className={`thumb ${i === activeIdx ? 'active' : ''}`}
                      aria-label={`Thumbnail ${i + 1}`}
                      onClick={() => setActiveIdx(i)}
                    >
                      <img src={src} alt={`Thumbnail ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="content">
              <div className="brand">{brand}</div>
              <h1 className="title">{title}</h1>
              <p className="subtitle">{description}</p>

              <div className="divider" />

              {!!colorVariants?.length && (
                <div className="colorRow">
                  <div className="colorLabel">Colour: {currentColor?.label}</div>
                  <div className="swatches" role="listbox" aria-label="Select colour">
                    {colorVariants.map((c) => (
                      <button
                        key={c.key}
                        role="option"
                        aria-selected={c.key === activeColorKey}
                        className={`swatch ${c.key === activeColorKey ? 'active' : ''}`}
                        onClick={() => setActiveColorKey(c.key)}
                        title={c.label}
                        style={{
                          background:
                            c.key === 'white'
                              ? 'radial-gradient(80% 80% at 30% 30%, #ffffff 0%, #eef1f5 80%)'
                              : c.key === 'black'
                              ? 'radial-gradient(80% 80% at 30% 30%, #0b0c10 0%, #1a1b20 80%)'
                              : `linear-gradient(135deg, ${c.accent}33, ${c.accent}66)`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!!perks?.length && (
                <div className="perkline" role="list">
                  {perks.map((p, i) => (
                    <span className="pill" role="listitem" key={`perk-${i}`}>
                      <span className="dot" /> {p}
                    </span>
                  ))}
                </div>
              )}

              <div className="priceRow">
                <div className="price">{currency}{price}</div>
                <div className="note">{note}</div>
              </div>

              <div className="controls" aria-label="Purchase controls">
                <div className="qty" aria-label="Quantity selector">
                  <button aria-label="Decrease quantity" onClick={() => setQty((n) => Math.max(1, n - 1))}>−</button>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={qty}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      setQty(Math.max(1, Number(v || 1)));
                    }}
                    aria-label="Quantity"
                  />
                  <button aria-label="Increase quantity" onClick={() => setQty((n) => n + 1)}>+</button>
                </div>

                <button className="cta" onClick={handleAddToCart}>Add to Bag</button>
                <button className="ghost" onClick={handleSave}>Save</button>
              </div>

              <p className="tiny">{tinyInfo}</p>
            </div>
          </section>
        </div>

        <div className={`toast ${added ? 'show' : ''}`} role="status" aria-live="polite">
          {qty} × {title} ({currentColor?.label}) added to bag.
        </div>
      </div>
    </>
  );
}