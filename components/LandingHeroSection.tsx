import { ArrowRight, Calendar, Ticket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-accent overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              The Future of <span className="text-primary">Events</span> is Here
            </h1>
            <p className="text-lg text-foreground/80 max-w-lg">
              Create, discover, and attend next-generation events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/create-event"
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                Create Event
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 bg-white border border-border text-foreground rounded-full hover:bg-muted transition-colors font-medium flex items-center justify-center"
              >
                Explore Events
              </Link>
            </div>
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-muted border-2 border-white overflow-hidden"
                  >
                    <Image
                      src={`/placeholder.avif`}
                      alt="User avatar"
                      width={32}
                      height={32}
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-foreground/80">
                <span className="font-medium text-primary">1,000+</span> events
                created this month
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 z-10 rounded-2xl"></div>
              <Image
                src="/placeholder.avif"
                alt="Event showcase"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Ticket size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Tickets</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Smart Scheduling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl"></div>
    </section>
  );
}
