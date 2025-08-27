// src/components/ProductCard.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ProductCard({
  id,
  brand,
  title,
  price,
  currency = '$',
  cover,
  description,
  note,
  topShippingText,
  tinyInfo,
  colorVariants = [],
}) {
  // Fix: Default to first variant's key if available
  const [selectedKey, setSelectedKey] = useState(
    colorVariants.length ? colorVariants[0].key : null
  );
  const [isOpen, setIsOpen] = useState(false);
  const scrollLockRef = useRef({ prev: '' });

  // Add state for selected hero image (for thumbnails)
  const [heroSrc, setHeroSrc] = useState(
    colorVariants.length ? colorVariants[0].hero : cover
  );

  // Update heroSrc when selectedKey changes
  useEffect(() => {
    const variant = colorVariants.find(v => v.key === selectedKey);
    setHeroSrc(variant?.hero || cover);
  }, [selectedKey, colorVariants, cover]);

  // Fix: fallback to null, not colorVariants
  const selectedVariant = useMemo(
    () => colorVariants.find(v => v.key === selectedKey) ?? null,
    [colorVariants, selectedKey]
  );

  // Smooth, reversible body scroll lock (no layout flicker)
  useLayoutEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const prev = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    scrollLockRef.current.prev = prev;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '';
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = scrollLockRef.current.prev.overflow || '';
      body.style.paddingRight = scrollLockRef.current.prev.paddingRight || '';
    };
  }, [isOpen]);

  // Simple fade/scale animation classes
  const overlayRef = useRef(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.98)';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 200ms ease, transform 220ms ease';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    } else {
      // no-op; closing animated via class on container
    }
    return () => {
      if (el) {
        el.style.transition = '';
        el.style.opacity = '';
        el.style.transform = '';
      }
    };
  }, [isOpen]);

  return (
    <article
      className="group relative w-full max-w-[22rem] aspect-[2/3] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 border border-black/5"
      aria-labelledby={`${id}-title`}
    >
      {/* Top shipping strip */}
      {topShippingText ? (
        <div className="absolute top-0 left-0 right-0 z-10 text-[11px] tracking-wide text-center py-1 bg-black text-white/90">
          {topShippingText}
        </div>
      ) : null}

      {/* Image */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative w-full h-full focus:outline-none"
        aria-label={`Open ${title}`}
      >
        <img
          src={heroSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* subtle gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
      </button>

      {/* Info panel */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <div className="flex items-center gap-2 text-xs opacity-90">
          <span>{brand}</span>
          <span className="opacity-60">•</span>
          <span>{currency}{price}</span>
        </div>
        <h3 id={`${id}-title`} className="text-lg font-semibold mt-1">{title}</h3>
        {note ? <p className="text-[12px] opacity-90 mt-1">{note}</p> : null}

        {/* Color pills */}
        {colorVariants?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {colorVariants.map(variant => (
              <button
                key={variant.key}
                type="button"
                onClick={() => setSelectedKey(variant.key)}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                  selectedKey === variant.key
                    ? 'bg-white text-black border-white'
                    : 'bg-black/30 text-white border-white/20 hover:bg-black/20'
                }`}
                style={{
                  boxShadow:
                    selectedKey === variant.key
                      ? `0 0 0 2px ${variant.accent || '#0E5FFF'} inset`
                      : 'none',
                }}
                aria-pressed={selectedKey === variant.key}
              >
                {variant.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Fullscreen overlay (portal) */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[1px] flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <div
              ref={overlayRef}
              className="relative mx-4 w-full max-w-5xl bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-black/70">{brand}</span>
                  <span className="text-black/30">•</span>
                  <h2 className="text-base font-semibold">{title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">{currency}{price}</div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border px-2.5 py-1 text-sm hover:bg-black hover:text-white transition"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: gallery */}
                <div className="relative">
                  <img
                    src={heroSrc}
                    alt={`${title} hero`}
                    className="w-full h-[52vh] md:h-[70vh] object-cover"
                  />
                  {/* Thumbnails */}
                  {selectedVariant?.thumbnails?.length ? (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/70 backdrop-blur px-2 py-1 rounded-full border">
                      {selectedVariant.thumbnails.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setHeroSrc(src)}
                          className="size-10 rounded-md overflow-hidden border hover:ring-2 hover:ring-black/40 transition"
                          aria-label={`View ${title} image ${i + 1}`}
                        >
                          <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Right: details */}
                <div className="p-5 md:p-6 flex flex-col gap-4">
                  <p className="text-sm text-black/70">{description}</p>
                  {tinyInfo ? <p className="text-xs text-black/60">{tinyInfo}</p> : null}

                  {/* Color selector again */}
                  {colorVariants?.length ? (
                    <div>
                      <div className="text-xs font-medium mb-2">Colors</div>
                      <div className="flex flex-wrap gap-2">
                        {colorVariants.map(variant => (
                          <button
                            key={variant.key}
                            type="button"
                            onClick={() => setSelectedKey(variant.key)}
                            className={`px-3 py-1.5 rounded-full text-[12px] border transition ${
                              selectedKey === variant.key
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-black border-black/20 hover:border-black/40'
                            }`}
                            style={{
                              boxShadow:
                                selectedKey === variant.key
                                  ? `0 0 0 2px ${variant.accent || '#0E5FFF'} inset`
                                  : 'none',
                            }}
                          >
                            {variant.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm hover:opacity-90"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </article>
  );
}
