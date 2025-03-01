import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl mb-10 text-white/90">
            Join thousands of organizers already using Eventsea to create
            unforgettable experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/create-event"
              className="px-8 py-4 bg-white text-primary rounded-full hover:bg-secondary hover:text-white transition-colors font-semibold shadow-lg"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
