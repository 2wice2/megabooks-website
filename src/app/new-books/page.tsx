"use client";

import { useState, useMemo } from "react";
import booksData from "@/data/new-fiction.json";

interface NewBook {
  t: string;
  a: string;
  p: number;
  rrp: number;
  isbn: string;
  cat: string[];
  pub: string;
  fmt: string;
  pg: number | null;
  imp: string;
  desc: string;
}

const books = booksData as NewBook[];
const PAGE_SIZE = 60;

const CATEGORIES = [
  "All",
  "Contemporary Fiction",
  "Crime & Thrillers",
  "Science Fiction & Fantasy",
  "Children's Fiction",
  "Romance",
  "Afrikaans",
  "Local Fiction",
  "Classics",
  "Graphic Novels",
  "Historical Fiction",
  "General & Literary Fiction",
  "Action & adventure",
  "Humour",
  "Short Stories & Anthologies",
];

export default function NewBooksPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<NewBook | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let results = books;
    if (category !== "All") {
      results = results.filter((b) => b.cat.some((c) => c === category));
    }
    if (q.length >= 2) {
      results = results.filter(
        (b) =>
          b.t.toLowerCase().includes(q) ||
          b.a.toLowerCase().includes(q) ||
          b.isbn.includes(q)
      );
    }
    return results.sort((a, b) => {
      const sa = a.a.trim().split(/\s+/).pop()?.toLowerCase() || "";
      const sb = b.a.trim().split(/\s+/).pop()?.toLowerCase() || "";
      if (!sa && sb) return 1;
      if (sa && !sb) return -1;
      if (sa !== sb) return sa.localeCompare(sb);
      return a.t.toLowerCase().localeCompare(b.t.toLowerCase());
    });
  }, [search, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      {/* Search Header */}
      <section className="glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-brand mb-2">
            New Fiction Books
          </h1>
          <p className="text-gray-400 mb-6">
            Browse {books.length.toLocaleString("en-ZA")} new fiction titles
            from Penguin Random House. Order via WhatsApp.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="w-full pl-10 pr-4 py-3 bg-dark border border-white/20 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="border-b border-white/10 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-[#FF6B00] text-white shadow-[0_0_12px_rgba(255,107,0,0.5)]"
                  : "bg-dark-light text-gray-400 hover:text-gray-200 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">
          Showing{" "}
          {Math.min(visibleCount, filtered.length).toLocaleString("en-ZA")} of{" "}
          {filtered.length.toLocaleString("en-ZA")} books
          {category !== "All" && (
            <span>
              {" "}
              in <span className="text-[#FF6B00]">{category}</span>
            </span>
          )}
          {search && (
            <span>
              {" "}
              matching &ldquo;
              <span className="text-brand">{search}</span>&rdquo;
            </span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No books found.</p>
            <p className="mt-2 text-sm">
              Try a different search term.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {visible.map((book) => (
                <div
                  key={book.isbn}
                  className="group cursor-pointer"
                  onClick={() => setSelected(book)}
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-dark-light">
                    <img
                      src={`/new-books/${book.isbn}.webp`}
                      alt={book.t}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-2 px-1">
                    <p className="text-xs text-gray-400 truncate">{book.a}</p>
                    <p className="text-sm text-gray-200 font-medium leading-tight line-clamp-2">
                      {book.t}
                    </p>
                    <p className="text-sm text-brand font-bold mt-1">
                      R{book.p}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  className="px-6 py-2 bg-dark-light border border-white/20 rounded-lg text-gray-300 hover:text-white hover:border-brand/50 transition-colors"
                >
                  Load More (
                  {(filtered.length - visibleCount).toLocaleString("en-ZA")}{" "}
                  remaining)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Detail Modal */}
      {selected && (
        <BookDetailModal
          book={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

/* ── Book Detail Modal ──────────────────────────────────────────────────── */

function BookDetailModal({
  book,
  onClose,
}: {
  book: NewBook;
  onClose: () => void;
}) {
  const waMessage = encodeURIComponent(
    `Hi, I'd like to order "${book.t}" by ${book.a} (ISBN: ${book.isbn}) at R${book.p}. Is it available?`
  );
  const waLink = `https://wa.me/27697203470?text=${waMessage}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto glass-strong rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl leading-none z-10"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Cover image */}
          <div className="shrink-0 mx-auto md:mx-0">
            <img
              src={`/new-books/${book.isbn}.webp`}
              alt={book.t}
              className="w-48 md:w-56 rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-100 leading-tight">
              {book.t}
            </h2>
            <p className="text-gray-400 mt-1">{book.a}</p>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-brand">R{book.p}</span>
              <span className="text-sm text-gray-500 line-through">
                RRP R{book.rrp}
              </span>
            </div>

            {/* Order button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </a>

            {/* Metadata */}
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {book.isbn && (
                <>
                  <span className="text-gray-500">ISBN</span>
                  <span className="text-gray-300">{book.isbn}</span>
                </>
              )}
              {book.pub && (
                <>
                  <span className="text-gray-500">Published</span>
                  <span className="text-gray-300">{book.pub}</span>
                </>
              )}
              {book.imp && (
                <>
                  <span className="text-gray-500">Imprint</span>
                  <span className="text-gray-300">{book.imp}</span>
                </>
              )}
              {book.fmt && (
                <>
                  <span className="text-gray-500">Format</span>
                  <span className="text-gray-300">{book.fmt}</span>
                </>
              )}
              {book.pg && (
                <>
                  <span className="text-gray-500">Pages</span>
                  <span className="text-gray-300">{book.pg}</span>
                </>
              )}
              {book.cat.length > 0 && (
                <>
                  <span className="text-gray-500">Categories</span>
                  <span className="text-gray-300">
                    {book.cat.filter((c) => c !== "New Releases").join(", ")}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {book.desc && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  About this book
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {book.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
