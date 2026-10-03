"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  className?: string;
  placeholder?: string;
};

export default function SearchBar({
  className,
  placeholder = "Search products...",
}: SearchBarProps) {
  return (
    <div className={cn("flex w-full items-center gap-2", className)}>
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <Input id="site-search" placeholder={placeholder} />
      <Button size="icon" type="button" aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
    </div>
  );
}
