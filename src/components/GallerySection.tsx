"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const GALLERY_IMAGES = Array.from({ length: 28 }, (_, i) => ({
  src: `/images/shop-${i + 1}.jpg`,
  alt: `MegaBooks store interior ${i + 1}`,
}));

export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length : null
    );
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % GALLERY_IMAGES.length : null
    );
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const current = lightboxIndex !== null ? GALLERY_IMAGES[lightboxIndex] : null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">
          Take a Look Around Our Store
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              onClick={() => openLightbox(i)}
              className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label={img.alt}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-2 0h-4m2-2v4" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between glass-strong px-4 py-3 rounded-t-xl border-b-0">
              <span className="text-sm text-gray-400">
                <span className="text-brand font-medium">MegaBooks</span>
                {"  "}
                <span className="text-gray-500">
                  {lightboxIndex + 1} / {GALLERY_IMAGES.length}
                </span>
              </span>
              <button
                onClick={closeLightbox}
                className="text-gray-400 hover:text-white text-2xl leading-none px-2"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Image area */}
            <div className="relative bg-dark rounded-b-xl border border-white/10 border-t-0 overflow-hidden group">
              <img
                src={current.src}
                alt={current.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Prev */}
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="group/prev absolute left-2 top-1/2 -translate-y-1/2 z-20
                  w-14 h-14 flex items-center justify-center rounded-full
                  bg-black/60 backdrop-blur-sm
                  opacity-0 group-hover:opacity-100 transition-opacity
                  active:scale-95"
                aria-label="Previous photo"
              >
                <div className="relative w-10 h-10 -scale-x-100">
                  <img src="/images/books-nav.svg" alt=""
                    className="absolute inset-0 w-full h-full brightness-0 invert drop-shadow-lg" />
                  <img src="/images/books-nav.svg" alt=""
                    className="absolute inset-0 w-full h-full drop-shadow-lg opacity-0 group-hover/prev:opacity-100 transition-opacity"
                    style={{
                      filter: "brightness(0) invert(15%) sepia(100%) saturate(10000%) hue-rotate(0deg)",
                      clipPath: "inset(0 0 0 48%)",
                    }} />
                </div>
              </button>

              {/* Next */}
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="group/next absolute right-2 top-1/2 -translate-y-1/2 z-20
                  w-14 h-14 flex items-center justify-center rounded-full
                  bg-black/60 backdrop-blur-sm
                  opacity-0 group-hover:opacity-100 transition-opacity
                  active:scale-95"
                aria-label="Next photo"
              >
                <div className="relative w-10 h-10">
                  <img src="/images/books-nav.svg" alt=""
                    className="absolute inset-0 w-full h-full brightness-0 invert drop-shadow-lg" />
                  <img src="/images/books-nav.svg" alt=""
                    className="absolute inset-0 w-full h-full drop-shadow-lg opacity-0 group-hover/next:opacity-100 transition-opacity"
                    style={{
                      filter: "brightness(0) invert(15%) sepia(100%) saturate(10000%) hue-rotate(0deg)",
                      clipPath: "inset(0 0 0 48%)",
                    }} />
                </div>
              </button>
            </div>

            {/* Swipe hint (mobile only) */}
            <p className="text-center text-xs text-gray-600 mt-2 sm:hidden">Swipe to browse</p>
          </div>
        </div>
      )}
    </>
  );
}
