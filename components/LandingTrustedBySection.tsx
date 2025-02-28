import Image from "next/image";

export default function TrustedBySection() {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <p className="text-center text-foreground/60 text-sm uppercase font-medium mb-8">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={`/placeholder.avif`}
                alt={`Partner logo ${i}`}
                width={120}
                height={32}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
