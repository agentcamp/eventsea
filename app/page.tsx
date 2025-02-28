import Image from "next/image";
import Footer from "@/components/LandingFooter";
import HeroSection from "@/components/LandingHeroSection";
import TrustedBySection from "@/components/LandingTrustedBySection";
import FeatureSection from "@/components/LandingFeatureSection";
import CtaSection from "@/components/LandingCtaSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Features Section */}
      <FeatureSection />

      {/* Testimonial Section */}
      <section className="py-20 bg-muted relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              What Our Customers Say
            </h2>

            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl">
              <p className="text-xl md:text-2xl font-medium text-foreground/80 italic mb-8">
                &quot;Eventsea transformed how we run our tech conferences. The
                token-gated access and real-time analytics have increased our
                attendance by 40% and improved attendee satisfaction.&quot;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.avif"
                    alt="Testimonial author"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-foreground/60">
                    CTO, TechConf Inc.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
