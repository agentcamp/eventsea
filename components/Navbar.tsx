"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown";

export default function Navbar() {
  const { data: session } = useSession();

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
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={session.user?.image || "/default-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="w-full text-foreground/80 hover:text-primary"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/api/auth/signin"
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
