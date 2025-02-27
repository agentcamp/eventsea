'use client';

import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              The Future of Events is Here
            </h1>
            <p className="text-xl text-white/90">
              Create, discover, and attend next-generation events powered by Web3 technology. Join over 10,000+ event organizers revolutionizing the event industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/create-event" 
                className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-secondary transition-colors font-semibold text-center"
              >
                Create Event
              </Link>
              <Link href="/events" className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary transition-colors font-semibold text-center">
                Explore Events
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/hero-event.jpg"
              alt="Event showcase"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gradient-secondary">Why Choose Eventsea?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Token-Gated Events",
                description: "Create exclusive experiences with NFT-powered access control",
                icon: "🎟️"
              },
              {
                title: "Seamless Ticketing",
                description: "Issue and manage tickets with blockchain security",
                icon: "🔐"
              },
              {
                title: "Real-Time Analytics",
                description: "Track engagement and revenue with detailed insights",
                icon: "📊"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-secondary text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{feature.title}</h3>
                <p className="text-accent">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-white">Trusted by Industry Leaders</h2>
          <div className="flex flex-wrap justify-center gap-12 items-center">
            {/* Add partner logos here */}
            <div className="w-32 h-12 bg-white/10 backdrop-blur rounded"></div>
            <div className="w-32 h-12 bg-white/10 backdrop-blur rounded"></div>
            <div className="w-32 h-12 bg-white/10 backdrop-blur rounded"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Events?</h2>
          <p className="text-xl mb-8 text-white opacity-90">Join thousands of organizers already using Eventsea</p>
          <Link href="/create-event" className="inline-block px-8 py-4 bg-white text-accent rounded-lg hover:bg-secondary transition-colors font-semibold">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
            © 2024 Eventsea. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
