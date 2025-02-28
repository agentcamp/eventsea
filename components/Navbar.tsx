import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="font-bold text-xl">Eventsea</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/events"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/create-event"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Create
          </Link>
          <Link
            href="#"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            My Events
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
