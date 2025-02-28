import { BarChart3, CheckCircle, Ticket } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Eventsea?
          </h2>
          <p className="text-foreground/70">
            Our platform combines the best of Web3 technology with user-friendly
            tools to create unforgettable event experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Token-Gated Events",
              description:
                "Create exclusive experiences with NFT-powered access control for your community",
              icon: <Ticket className="h-6 w-6 text-primary" />,
            },
            {
              title: "Seamless Ticketing",
              description:
                "Issue and manage tickets with blockchain security that prevents fraud and scalping",
              icon: <CheckCircle className="h-6 w-6 text-primary" />,
            },
            {
              title: "Real-Time Analytics",
              description:
                "Track engagement and revenue with detailed insights to optimize your events",
              icon: <BarChart3 className="h-6 w-6 text-primary" />,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-white border border-border hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/35 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
