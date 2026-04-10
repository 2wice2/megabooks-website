"use client";

import { useState, useMemo } from "react";
import stockData from "@/data/stock.json";
import newArrivalsData from "@/data/new-arrivals.json";
import ShelfImageModal from "@/components/ShelfImageModal";

interface Book {
  t: string; // title
  a: string; // author
  c: number; // count
  l: string; // location/category
  s?: string; // shelf location (e.g. "English novels 45")
}

const books = stockData as Book[];
const newArrivals = (newArrivalsData as { t: string; a: string; c: number; s?: string }[]).map(
  (b) => ({ ...b, l: "New Arrivals" }) as Book
);

const CATEGORIES = [
  "All",
  "New Arrivals",
  "English novels",
  "Afrikaans novels",
  "Sci-Fi",
  "Biographies",
  "Non-Fiction",
  "Classics",
  "Teens-Young Adult",
  "True Crime",
  "English Self Help",
  "English religious Fiction",
  "English religious Non-Fiction",
  "English single author",
  "Afrikaans single author",
  "Poetry-Plays",
  "Bibles",
  "Foreign language",
  "Myths-Ancient History",
  "Westerns",
];

const CATEGORY_COLORS: Record<string, { pill: string; hover: string; glow: string; pillGlow: string }> = {
  "English novels": { pill: "bg-[#CC00CC]", hover: "hover:border-[#CC00CC]/30", glow: "hover:shadow-[0_0_15px_rgba(204,0,204,0.25)]", pillGlow: "shadow-[0_0_12px_rgba(204,0,204,0.5)]" },
  "Afrikaans novels": { pill: "bg-[#00B359]", hover: "hover:border-[#00B359]/30", glow: "hover:shadow-[0_0_15px_rgba(0,179,89,0.25)]", pillGlow: "shadow-[0_0_12px_rgba(0,179,89,0.5)]" },
  "Biographies": { pill: "bg-white text-black", hover: "hover:border-white/30", glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]", pillGlow: "shadow-[0_0_12px_rgba(255,255,255,0.4)]" },
};
const CATEGORY_HEX: Record<string, string> = {
  "English novels": "#CC00CC",
  "Afrikaans novels": "#00B359",
  "Biographies": "#FFFFFF",
};
const DEFAULT_PILL = "bg-brand";
const DEFAULT_HOVER = "hover:border-brand/30";
const DEFAULT_GLOW = "hover:shadow-[0_0_15px_rgba(230,0,0,0.25)]";
const DEFAULT_PILL_GLOW = "shadow-[0_0_12px_rgba(230,0,0,0.5)]";

const PAGE_SIZE = 100;

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let results: Book[] = category === "New Arrivals" ? newArrivals : books;

    if (category !== "All" && category !== "New Arrivals") {
      results = results.filter((b) => b.l === category);
    }

    if (q.length >= 2) {
      results = results.filter(
        (b) =>
          b.t.toLowerCase().includes(q) || b.a.toLowerCase().includes(q)
      );
    }

    // Sort alphabetically by author surname (no-author books go to end)
    return results.sort((a, b) => {
      const surnameA = a.a.trim().split(/\s+/).pop()?.toLowerCase() || "";
      const surnameB = b.a.trim().split(/\s+/).pop()?.toLowerCase() || "";
      if (!surnameA && surnameB) return 1;
      if (surnameA && !surnameB) return -1;
      if (surnameA !== surnameB) return surnameA.localeCompare(surnameB);
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
          <h1 className="text-3xl font-bold text-brand mb-2">Browse Our Stock</h1>
          <p className="text-gray-400 mb-6">
            Search through {(books.length + newArrivals.length).toLocaleString("en-ZA")} books. Find
            something you like? WhatsApp us to check availability.
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
              placeholder="Search by title or author..."
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
                  ? `${CATEGORY_COLORS[cat]?.pill || DEFAULT_PILL} ${CATEGORY_COLORS[cat]?.pill.includes("text-") ? "" : "text-white"} ${CATEGORY_COLORS[cat]?.pillGlow || DEFAULT_PILL_GLOW}`
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
          Showing {Math.min(visibleCount, filtered.length).toLocaleString("en-ZA")} of{" "}
          {filtered.length.toLocaleString("en-ZA")} books
          {category !== "All" && (
            <span>
              {" "}
              in <span className="text-brand">{category}</span>
            </span>
          )}
          {search && (
            <span>
              {" "}
              matching &ldquo;<span className="text-brand">{search}</span>&rdquo;
            </span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No books found.</p>
            <p className="mt-2 text-sm">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {visible.map((book, i) => (
                <div
                  key={`${book.t}-${book.a}-${i}`}
                  className={`glass rounded-lg p-4 ${CATEGORY_COLORS[category]?.hover || DEFAULT_HOVER} ${CATEGORY_COLORS[category]?.glow || DEFAULT_GLOW} transition-all ${
                    book.s ? "cursor-pointer" : ""
                  }`}
                  onClick={() => book.s && setSelectedBook(book)}
                >
                  <h3 className="font-semibold text-gray-200 text-sm leading-tight line-clamp-2">
                    {book.t}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">{book.a}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-dark text-gray-400 border border-white/10">
                      {book.s || book.l || "Uncategorized"}
                    </span>
                    <div className="flex items-center gap-2">
                      {book.c > 1 && (
                        <span className="text-xs text-brand font-medium">
                          {book.c} copies
                        </span>
                      )}
                      {book.s && (
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-label="View shelf image"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
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
                  Load More ({(filtered.length - visibleCount).toLocaleString("en-ZA")}{" "}
                  remaining)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Shelf Image Modal */}
      <ShelfImageModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        accentColor={selectedBook ? (CATEGORY_HEX[selectedBook.l] ?? "#e60000") : "#e60000"}
      />
    </>
  );
}
