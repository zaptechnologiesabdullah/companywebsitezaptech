import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import zapLogo from "@/assets/zap-logo.png";

const fallbackNavItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Hire a Developer", href: "/hire" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact Us", href: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: dbLinks = [] } = useQuery({
    queryKey: ['public-header-links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('managed_links').select('*').eq('category', 'header').order('sort_order');
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const navItems = dbLinks.length > 0
    ? dbLinks.map(l => ({ label: l.name, href: l.url, target: l.target || '_self' }))
    : fallbackNavItems.map(l => ({ ...l, target: '_self' }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-3">
      <div
        className={`mx-auto max-w-7xl transition-all duration-500 rounded-full px-4 md:px-6 ${
          scrolled
            ? "bg-background/95 backdrop-blur-xl shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.15)]"
            : "bg-background/90 backdrop-blur-md shadow-[0_4px_20px_-4px_hsl(var(--foreground)/0.08)]"
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src={zapLogo} alt="Zap Technologies" className="h-12 md:h-14 w-auto" />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                className={`relative px-3 xl:px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  currentPath === item.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="cta"
              size="sm"
              className="hidden sm:inline-flex rounded-full px-5 gap-2 group"
              asChild
            >
              <a href="/contact">
                Get Started
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden mx-auto max-w-7xl mt-2 rounded-2xl bg-background/95 backdrop-blur-xl shadow-[0_8px_32px_-8px_hsl(var(--foreground)/0.15)] overflow-hidden">
          <nav className="py-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                className={`block px-6 py-3 text-sm font-semibold transition-colors rounded-lg mx-2 ${
                  currentPath === item.href
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="px-4 pt-2 pb-1">
              <Button variant="cta" size="sm" className="w-full rounded-full gap-2" asChild>
                <a href="/contact">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
