"use client";

import { useState, useEffect, useCallback } from "react";
import { shelfImagePath, parseShelfLocation } from "@/lib/shelf-image-path";
import BookPageIcon from "@/components/BookPageIcon";

interface Book {
  t: string;
  a: string;
  s?: string;
}

interface ShelfImageModalProps {
  book: Book | null;
  onClose: () => void;
  accentColor?: string;
}

export default function ShelfImageModal({ book, onClose, accentColor = "#e60000" }: ShelfImageModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offset, setOffset] = useState(0);

  const parsed = book?.s ? parseShelfLocation(book.s) : null;
  const currentNumber = parsed ? parsed.number + offset : 0;
  const currentLabel = parsed ? `${parsed.label} ${currentNumber}` : book?.s ?? "";
  const imgSrc = parsed
    ? `/shelf-images/${parsed.section}/${parsed.section}-${currentNumber}.jpg`
    : book?.s ? shelfImagePath(book.s) : "";

  useEffect(() => {
    if (book) {
      setLoading(true);
      setError(false);
      setOffset(0);
    }
  }, [book]);

  const navigate = useCallback((dir: -1 | 1) => {
    if (!parsed) return;
    const next = currentNumber + dir;
    if (next < 1) return;
    setOffset((prev) => prev + dir);
    setLoading(true);
    setError(false);
  }, [parsed, currentNumber]);

  useEffect(() => {
    if (!book) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [book, onClose, navigate]);

  if (!book || !book.s) return null;

  const waMessage = encodeURIComponent(
    `Hi, I'm interested in "${book.t}"${book.a ? ` by ${book.a}` : ""}. Is it still available?`
  );
  const waLink = `https://wa.me/27697203470?text=${waMessage}`;

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
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-gray-400">
                Shelf: <span className="text-brand font-medium">{currentLabel}</span>
              </p>
              {offset === 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {book.t} — {book.a}
                </p>
              )}
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

        {/* Image with nav arrows */}
        <div className="relative bg-dark rounded-b-xl border border-white/10 border-t-0 overflow-hidden">
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
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
              alt={`Bookshelf: ${currentLabel}`}
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

          {/* Prev button */}
          {parsed && currentNumber > 1 && (
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 glass-strong text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
              style={{ borderColor: `${accentColor}30`, boxShadow: `0 0 12px ${accentColor}30` }}
              aria-label="Previous shelf"
            >
              <BookPageIcon direction="prev" color={accentColor} />
            </button>
          )}

          {/* Next button */}
          {parsed && (
            <button
              onClick={() => navigate(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 glass-strong text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
              style={{ borderColor: `${accentColor}30`, boxShadow: `0 0 12px ${accentColor}30` }}
              aria-label="Next shelf"
            >
              <BookPageIcon direction="next" color={accentColor} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
