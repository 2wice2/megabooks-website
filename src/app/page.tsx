import Image from "next/image";
import Link from "next/link";
import newArrivals from "@/data/new-arrivals.json";

const GALLERY_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/shop-${i + 1}.jpg`,
  alt: `MegaBooks store interior ${i + 1}`,
}));

const NEW_ARRIVALS = (newArrivals as { t: string; a: string; c: number }[]).slice(0, 24);

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="/images/hero.jpg"
          alt="MegaBooks store interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-black text-brand drop-shadow-lg">
            MegaBooks
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl mx-auto">
            Pretoria&apos;s favourite second-hand bookshop. Thousands of titles,
            waiting for their next reader.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-block bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Browse Our Stock
            </Link>
            <a
              href="https://wa.me/27817205670"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-dark-light rounded-xl p-6 border border-white/10">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-bold text-brand mb-2">25,000+ Books</h3>
            <p className="text-gray-400 text-sm">
              From Afrikaans novels to Sci-Fi, Biographies to True Crime — we
              have something for every reader.
            </p>
          </div>
          <div className="bg-dark-light rounded-xl p-6 border border-white/10">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-brand mb-2">Affordable</h3>
            <p className="text-gray-400 text-sm">
              Quality second-hand books at great prices. Browse in-store or
              search our stock online.
            </p>
          </div>
          <div className="bg-dark-light rounded-xl p-6 border border-white/10">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-bold text-brand mb-2">Book Requests</h3>
            <p className="text-gray-400 text-sm">
              Looking for something specific? WhatsApp us and we&apos;ll let you
              know if it&apos;s still available.
            </p>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-200">
            New Arrivals
          </h2>
          <Link
            href="/browse"
            className="text-sm text-brand hover:text-brand-dark transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {NEW_ARRIVALS.map((book, i) => (
            <div
              key={`${book.t}-${i}`}
              className="bg-dark-light rounded-lg p-4 border border-white/10 hover:border-brand/30 transition-colors"
            >
              <h3 className="font-semibold text-gray-200 text-sm leading-tight line-clamp-2">
                {book.t}
              </h3>
              {book.a && (
                <p className="text-gray-400 text-xs mt-1 line-clamp-1">{book.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-200">
          Take a Look Around Our Store
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.src}
              className="relative aspect-video rounded-lg overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
