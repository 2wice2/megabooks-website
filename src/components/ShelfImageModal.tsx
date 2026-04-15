"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  shelfImagePath,
  parseShelfLocation,
  shelfImagePathFromParts,
} from "@/lib/shelf-image-path";

// Max image number per section (generated from public/shelf-images)
const SECTION_MAX: Record<string, number> = {
  "afrikaans-novels": 21,
  "afrikaans-single-author": 3,
  bibles: 5,
  biographies: 27,
  classics: 19,
  "english-novels": 317,
  "english-religious-fiction": 4,
  "english-religious-non-fiction": 4,
  "english-self-help": 16,
  "english-single-author": 3,
  "foreign-language": 4,
  "myths-ancient-history": 2,
  "new-arrivals": 24,
  "non-fiction-1": 12,
  "non-fiction-2": 15,
  "non-fiction-3": 57,
  "non-fiction-4": 37,
  "poetry-plays": 5,
  "sci-fi": 48,
  "teens-young-adult": 19,
  "true-crime": 3,
  westerns: 4,
};

interface Book {
  t: string;
  a: string;
  s?: string;
}

interface ShelfImageModalProps {
  book: Book | null;
  onClose: () => void;
}

export default function ShelfImageModal({ book, onClose }: ShelfImageModalProps) {
  const parsed = book?.s ? parseShelfLocation(book.s) : null;
  const [currentNum, setCurrentNum] = useState(parsed?.number ?? 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const section = parsed?.section ?? "";
  const maxNum = SECTION_MAX[section] ?? 1;
  const canNav = maxNum > 1;

  // Reset when a new book is selected
  useEffect(() => {
    if (book?.s) {
      const p = parseShelfLocation(book.s);
      if (p) setCurrentNum(p.number);
      setLoading(true);
      setError(false);
    }
  }, [book]);

  // Reset loading state when navigating
  const navigateTo = useCallback(
    (num: number) => {
      if (num < 1 || num > maxNum) return;
      setCurrentNum(num);
      setLoading(true);
      setError(false);
    },
    [maxNum]
  );

  const goPrev = useCallback(
    () => navigateTo(currentNum - 1),
    [currentNum, navigateTo]
  );
  const goNext = useCallback(
    () => navigateTo(currentNum + 1),
    [currentNum, navigateTo]
  );

  useEffect(() => {
    if (!book) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (canNav && e.key === "ArrowLeft") goPrev();
      if (canNav && e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [book, onClose, canNav, goPrev, goNext]);

  // --- Touch swipe support ---
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null || !canNav) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;
      // Only trigger if horizontal swipe is dominant and > 50px
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [canNav, goNext, goPrev]
  );

  if (!book || !book.s || !parsed) return null;

  const imgSrc =
    currentNum === parsed.number
      ? shelfImagePath(book.s)
      : shelfImagePathFromParts(section, currentNum);

  const waMessage = encodeURIComponent(
    `Hi, I'm interested in "${book.t}"${book.a ? ` by ${book.a}` : ""}. Is it still available?`
  );
  const waLink = `https://wa.me/27697203470?text=${waMessage}`;

  const sectionLabel = section.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between glass-strong px-4 py-3 rounded-t-xl border-b-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-sm text-gray-400">
                <span className="text-brand font-medium">{sectionLabel}</span>
                {" "}
                <span className="text-gray-500">
                  {currentNum} / {maxNum}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {book.t} — {book.a}
              </p>
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full p-2 transition-colors"
              aria-label="Ask about this book on WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none px-2"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Image with nav arrows + swipe */}
        <div
          ref={imageContainerRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative bg-dark rounded-b-xl border border-white/10 border-t-0 overflow-hidden group"
        >
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              <p>Shelf image not available</p>
            </div>
          ) : (
            <img
              src={imgSrc}
              alt={`Bookshelf: ${sectionLabel} ${currentNum}`}
              className={`w-full h-auto max-h-[75vh] object-contain transition-opacity duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          )}

          {/* Prev / Next nav buttons */}
          {canNav && (
            <>
              {/* Previous — book icon flipped */}
              <button
                onClick={goPrev}
                disabled={currentNum <= 1}
                className="group/prev absolute left-2 top-1/2 -translate-y-1/2 z-20
                  w-14 h-14 flex items-center justify-center rounded-full
                  bg-black/60 backdrop-blur-sm
                  opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity
                  disabled:hidden
                  active:scale-95"
                aria-label="Previous shelf image"
              >
                <div
                  className="w-10 h-10 -scale-x-100 transition-colors bg-white group-hover/prev:bg-brand"
                  style={{
                    maskImage: "url(/images/books-nav.svg)",
                    WebkitMaskImage: "url(/images/books-nav.svg)",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </button>
              {/* Next — book icon */}
              <button
                onClick={goNext}
                disabled={currentNum >= maxNum}
                className="group/next absolute right-2 top-1/2 -translate-y-1/2 z-20
                  w-14 h-14 flex items-center justify-center rounded-full
                  bg-black/60 backdrop-blur-sm
                  opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity
                  disabled:hidden
                  active:scale-95"
                aria-label="Next shelf image"
              >
                <div
                  className="w-10 h-10 transition-colors bg-white group-hover/next:bg-brand"
                  style={{
                    maskImage: "url(/images/books-nav.svg)",
                    WebkitMaskImage: "url(/images/books-nav.svg)",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
