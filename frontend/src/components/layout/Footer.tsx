import Logo from "@/components/common/Logo";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <Logo className="text-xl" />

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MarketPlace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
