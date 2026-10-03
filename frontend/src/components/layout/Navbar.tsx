"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User } from "lucide-react";

import Logo from "@/components/common/Logo";
import SearchBar from "@/components/common/SearchBar";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />

        <div className="hidden w-full max-w-xl md:block">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-5">
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart className="h-6 w-6" />
          </Link>

          <Link href="/cart" aria-label="Cart">
            <ShoppingCart className="h-6 w-6" />
          </Link>

          <Link href="/profile" aria-label="Profile">
            <User className="h-6 w-6" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
