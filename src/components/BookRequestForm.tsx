"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import stockData from "@/data/stock.json";

interface StockBook {
  t: string;
  a: string;
  c: number;
  l: string;
  s?: string;
}

interface AuthorOption {
  name: string;
}

interface TitleOption {
  title: string;
  authors: string[];
}

const stock = stockData as StockBook[];

const WA_NUMBER = "27697203470";

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";
const API_KEY = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || "")
  : "";

function booksUrl(query: string, maxResults = 20) {
  const params = new URLSearchParams({ q: query, maxResults: String(maxResults) });
  if (API_KEY) params.set("key", API_KEY);
  return `${GOOGLE_BOOKS_BASE}?${params}`;
}

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let id: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

export default function BookRequestForm() {
  // --- Author state ---
  const [authorQuery, setAuthorQuery] = useState("");
  const [authorResults, setAuthorResults] = useState<AuthorOption[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorOption | null>(null);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const authorRef = useRef<HTMLDivElement>(null);

  // --- Title state ---
  const [titleQuery, setTitleQuery] = useState("");
  const [titleResults, setTitleResults] = useState<TitleOption[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [titleLoading, setTitleLoading] = useState(false);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  // --- Stock match ---
  const [stockMatch, setStockMatch] = useState<StockBook | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (authorRef.current && !authorRef.current.contains(e.target as Node)) {
        setShowAuthorDropdown(false);
      }
      if (titleRef.current && !titleRef.current.contains(e.target as Node)) {
        setShowTitleDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // --- Author search (Google Books) ---
  const searchAuthors = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setAuthorResults([]);
        return;
      }
      setAuthorLoading(true);
      try {
        const res = await fetch(booksUrl(`inauthor:${q}`, 20));
        const data = await res.json();
        // Extract unique author names from results
        const seen = new Set<string>();
        const authors: AuthorOption[] = [];
        for (const item of data.items || []) {
          for (const name of item.volumeInfo?.authors || []) {
            const lower = name.toLowerCase();
            if (!seen.has(lower) && lower.includes(q.toLowerCase())) {
              seen.add(lower);
              authors.push({ name });
            }
          }
        }
        setAuthorResults(authors.slice(0, 8));
        setShowAuthorDropdown(true);
      } catch {
        setAuthorResults([]);
      } finally {
        setAuthorLoading(false);
      }
    }, 300),
    []
  );

  function handleAuthorInput(val: string) {
    setAuthorQuery(val);
    setSelectedAuthor(null);
    setTitleQuery("");
    setSelectedTitle("");
    setTitleResults([]);
    setStockMatch(null);
    searchAuthors(val as never);
  }

  function pickAuthor(author: AuthorOption) {
    setSelectedAuthor(author);
    setAuthorQuery(author.name);
    setShowAuthorDropdown(false);
    setTitleQuery("");
    setSelectedTitle("");
    setStockMatch(null);
    loadWorks(author.name);
  }

  // --- Load works for selected author (Google Books) ---
  async function loadWorks(authorName: string) {
    setTitleLoading(true);
    try {
      const res = await fetch(booksUrl(`inauthor:"${authorName}"`, 40));
      const data = await res.json();
      const seen = new Set<string>();
      const works: TitleOption[] = [];
      for (const item of data.items || []) {
        const vi = item.volumeInfo;
        if (!vi?.title) continue;
        const key = vi.title.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        works.push({ title: vi.title, authors: vi.authors || [] });
      }
      works.sort((a, b) => a.title.localeCompare(b.title));
      setTitleResults(works);
    } catch {
      setTitleResults([]);
    } finally {
      setTitleLoading(false);
    }
  }

  // --- Live title search as user types (Google Books) ---
  const searchTitles = useCallback(
    debounce(async (q: string, authorName: string) => {
      if (q.length < 2) return;
      setTitleLoading(true);
      try {
        const res = await fetch(
          booksUrl(`inauthor:"${authorName}"+intitle:${q}`, 20)
        );
        const data = await res.json();
        const seen = new Set<string>();
        const works: TitleOption[] = [];
        for (const item of data.items || []) {
          const vi = item.volumeInfo;
          if (!vi?.title) continue;
          const key = vi.title.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          works.push({ title: vi.title, authors: vi.authors || [] });
        }
        works.sort((a, b) => a.title.localeCompare(b.title));
        setTitleResults(works);
        setShowTitleDropdown(true);
      } catch {
        /* keep existing results */
      } finally {
        setTitleLoading(false);
      }
    }, 300),
    []
  );

  // --- Title filtering ---
  const filteredTitles = titleQuery.length >= 1
    ? titleResults.filter((w) =>
        w.title.toLowerCase().includes(titleQuery.toLowerCase())
      )
    : titleResults;

  function handleTitleInput(val: string) {
    setTitleQuery(val);
    setSelectedTitle("");
    setStockMatch(null);
    setShowTitleDropdown(true);
    // If author is selected, do a live Google Books search for better results
    if (selectedAuthor && val.length >= 2) {
      searchTitles(val as never, selectedAuthor.name as never);
    }
  }

  function pickTitle(title: string) {
    setTitleQuery(title);
    setSelectedTitle(title);
    setShowTitleDropdown(false);
    checkStock(title, selectedAuthor?.name || authorQuery);
  }

  // --- Stock cross-reference ---
  function checkStock(title: string, author: string) {
    const tLower = title.toLowerCase();
    const aLower = author.toLowerCase();
    const match = stock.find(
      (b) =>
        b.t.toLowerCase() === tLower &&
        b.a.toLowerCase().includes(aLower.split(" ").pop() || "")
    );
    setStockMatch(match || null);
  }

  // --- WhatsApp link ---
  const finalAuthor = selectedAuthor?.name || authorQuery.trim();
  const finalTitle = selectedTitle || titleQuery.trim();
  const canSend = finalAuthor.length >= 2 && finalTitle.length >= 2;

  const waMessage = `Hi MegaBooks! I'm looking for a 2nd-hand copy of "${finalTitle}" by ${finalAuthor}. Do you have it or can you source it?`;
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="space-y-6">
      {/* Author Input */}
      <div ref={authorRef} className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Author
        </label>
        <div className="relative">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <input
            type="text"
            value={authorQuery}
            onChange={(e) => handleAuthorInput(e.target.value)}
            onFocus={() => authorResults.length > 0 && setShowAuthorDropdown(true)}
            placeholder="Start typing an author name..."
            className="w-full pl-10 pr-4 py-3 bg-dark border border-white/20 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          {authorLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Author dropdown */}
        {showAuthorDropdown && authorResults.length > 0 && (
          <ul className="absolute z-30 mt-1 w-full bg-dark-light border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {authorResults.map((a) => (
              <li
                key={a.name}
                onClick={() => pickAuthor(a)}
                className="px-4 py-3 hover:bg-brand/20 cursor-pointer transition-colors border-b border-white/5 last:border-0"
              >
                <span className="text-gray-200 font-medium">{a.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Title Input */}
      <div ref={titleRef} className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Book Title
        </label>
        <div className="relative">
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <input
            type="text"
            value={titleQuery}
            onChange={(e) => handleTitleInput(e.target.value)}
            onFocus={() => {
              if (titleResults.length > 0) setShowTitleDropdown(true);
            }}
            placeholder={
              selectedAuthor
                ? `Search ${selectedAuthor.name}'s works or type a title...`
                : "Type a book title..."
            }
            className="w-full pl-10 pr-4 py-3 bg-dark border border-white/20 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          />
          {titleLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Title dropdown */}
        {showTitleDropdown && filteredTitles.length > 0 && (
          <ul className="absolute z-30 mt-1 w-full bg-dark-light border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredTitles.slice(0, 20).map((w, i) => (
              <li
                key={`${w.title}-${i}`}
                onClick={() => pickTitle(w.title)}
                className="px-4 py-3 hover:bg-brand/20 cursor-pointer transition-colors border-b border-white/5 last:border-0"
              >
                <span className="text-gray-200">{w.title}</span>
              </li>
            ))}
            {filteredTitles.length > 20 && (
              <li className="px-4 py-2 text-gray-500 text-xs text-center">
                Keep typing to narrow down...
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Stock match result */}
      {selectedTitle && stockMatch && (
        <div className="glass rounded-lg p-4 border-l-4 border-[#25D366]">
          <p className="text-[#25D366] font-semibold">
            Good news — we have this in stock!
          </p>
          <p className="text-gray-400 text-sm mt-1">
            <span className="text-gray-200">{stockMatch.t}</span> by{" "}
            {stockMatch.a}
            {stockMatch.c > 1 && ` (${stockMatch.c} copies)`}
            {" — "}
            <span className="text-gray-500">{stockMatch.s || stockMatch.l}</span>
          </p>
          <a
            href={`/browse?q=${encodeURIComponent(stockMatch.t)}`}
            className="inline-block mt-3 text-sm text-brand hover:text-brand-dark font-medium transition-colors"
          >
            View on Browse page &rarr;
          </a>
        </div>
      )}

      {selectedTitle && !stockMatch && finalTitle.length >= 2 && (
        <div className="glass rounded-lg p-4 border-l-4 border-brand">
          <p className="text-gray-300">
            We don&apos;t currently have{" "}
            <span className="text-gray-100 font-medium">
              &ldquo;{finalTitle}&rdquo;
            </span>{" "}
            in stock. Send us a WhatsApp and we&apos;ll try to source it!
          </p>
        </div>
      )}

      {/* WhatsApp send button */}
      <div className="pt-2">
        {canSend ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Send Request via WhatsApp
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-3 bg-gray-600 text-gray-400 font-bold px-6 py-3 rounded-lg cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enter author &amp; title to send request
          </button>
        )}
      </div>

      {/* Preview of the message */}
      {canSend && (
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Message preview:</p>
          <p className="text-sm text-gray-300 italic">&ldquo;{waMessage}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
