import Image from "next/image";
import Link from "next/link";

const GALLERY_IMAGES = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/shop-${i + 1}.jpg`,
  alt: `MegaBooks store interior ${i + 1}`,
}));

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
          <h1 className="text-5xl md:text-7xl font-normal font-brand" style={{ color: "#e60000", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
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
            <Link
              href="/new-books"
              className="inline-block bg-[#FF6B00] hover:bg-[#E05500] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Order New Books
            </Link>
            <Link
              href="/request"
              className="inline-block bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Request a Book
            </Link>
            <a
              href="https://wa.me/27697203470"
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
          <div className="glass rounded-xl p-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-bold text-brand mb-2">25,000+ Books</h3>
            <p className="text-gray-400 text-sm">
              From Afrikaans novels to Sci-Fi, Biographies to True Crime — we
              have something for every reader.
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-brand mb-2">Affordable</h3>
            <p className="text-gray-400 text-sm">
              Quality second-hand books at great prices. Browse in-store or
              search our stock online.
            </p>
          </div>
          <Link href="/request" className="glass rounded-xl p-6 block hover:border-brand/30 transition-all">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="text-lg font-bold text-brand mb-2">Book Requests</h3>
            <p className="text-gray-400 text-sm">
              Looking for something specific? Search by author and title —
              we&apos;ll check stock and help you source it.
            </p>
          </Link>
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
