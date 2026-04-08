"use client";

import { useState, useEffect } from "react";
import { shelfImagePath } from "@/lib/shelf-image-path";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (book) {
      setLoading(true);
      setError(false);
    }
  }, [book]);

  useEffect(() => {
    if (!book) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [book, onClose]);

  if (!book || !book.s) return null;

  const imgSrc = shelfImagePath(book.s);

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
        <div className="flex items-center justify-between bg-dark-light px-4 py-3 rounded-t-xl border border-white/10 border-b-0">
          <div>
            <p className="text-sm text-gray-400">
              Shelf: <span className="text-brand font-medium">{book.s}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {book.t} — {book.a}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none px-2"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Image */}
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
              alt={`Bookshelf: ${book.s}`}
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
        </div>
      </div>
    </div>
  );
}
