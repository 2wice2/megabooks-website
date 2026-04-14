import BookRequestForm from "@/components/BookRequestForm";

export const metadata = {
  title: "Request a Book - MegaBooks",
  description:
    "Can't find the book you're looking for? Request a 2nd-hand book and we'll try to source it for you.",
};

export default function RequestPage() {
  return (
    <>
      {/* Hero */}
      <section className="glass-strong border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-brand mb-2">
            Request a Book
          </h1>
          <p className="text-gray-400">
            Looking for a specific second-hand book we don&apos;t have in stock?
            Search by author and title below — we&apos;ll check our shelves and
            try to source it for you.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <BookRequestForm />
      </section>

      {/* How it works */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-lg font-bold text-gray-300 mb-4">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">1</div>
            <p className="text-sm text-gray-400">
              Type an author name and pick from the suggestions
            </p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">2</div>
            <p className="text-sm text-gray-400">
              Choose a title or type your own
            </p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">3</div>
            <p className="text-sm text-gray-400">
              Hit the WhatsApp button — your message is ready to send
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
