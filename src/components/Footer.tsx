import Link from "next/link";

export default function Footer() {
  return (
    <footer className="glass-strong mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-brand font-bold text-lg mb-3 font-brand">MegaBooks</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pretoria&apos;s favourite second-hand bookshop. Thousands of titles
              across every genre, waiting for their next reader.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-200">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-brand transition-colors">Browse Stock</Link></li>
              <li><Link href="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-200">Contact Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Cliffendale Dr, Faerie Glen, Pretoria</li>
              <li>
                <a href="https://wa.me/27817205670" className="hover:text-brand transition-colors">
                  WhatsApp: 081 720 5670
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} MegaBooks. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
