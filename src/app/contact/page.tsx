import Image from "next/image";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[250px] flex items-center justify-center">
        <Image
          src="/images/contact-hero.jpg"
          alt="MegaBooks store"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative z-10 text-4xl md:text-5xl font-black text-brand drop-shadow-lg">
          Contact
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-brand mb-4">Get in Touch</h2>
              <p className="text-gray-400">
                Have a question or looking for a specific book? Reach out to us
                via WhatsApp or visit us in store.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Address</h3>
                  <p className="text-gray-400 text-sm">
                    Cliffendale Dr, Faerie Glen, Pretoria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">WhatsApp</h3>
                  <a
                    href="https://wa.me/27697203470"
                    className="text-brand hover:text-brand-dark text-sm transition-colors"
                  >
                    069 720 3470
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-200">Hours</h3>
                  <p className="text-gray-400 text-sm">
                    Monday - Friday: 9:00 - 17:00<br />
                    Saturday: 9:00 - 14:00<br />
                    Sunday: 9:00 - 13:00
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/27697203470"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Google Map */}
          <div className="rounded-xl overflow-hidden border border-white/10 h-[400px] md:h-auto">
            <iframe
              src="https://maps.google.com/maps?q=MegaBooks,+Cliffendale+Dr,+Faerie+Glen,+Pretoria&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "400px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MegaBooks location on Google Maps"
            />
          </div>
        </div>
      </section>
    </>
  );
}
