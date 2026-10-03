import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Velora Marketplace home"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/logos/velora-marketplace.svg"
        alt="Velora Marketplace"
        width={210}
        height={56}
        priority
        className="h-11 w-auto"
      />
    </Link>
  );
}
