import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronDown, Smartphone, Cloud, Code, ArrowRight, CheckCircle, Users, Briefcase, Star } from "lucide-react";
import { clientLogos as clientData } from "@/data/clientData";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const defaults = {
  headline: "Empowering Your Business with",
  headline_accent: "Cutting-Edge Technology",
  subheadline: "Tailored software solutions, cutting-edge mobile apps, and scalable cloud systems designed to propel your business forward.",
  cta_text: "Get a Quote",
  cta_link: "/contact",
};

const stats = [
  { label: "Projects Completed", value: 80, suffix: "+" },
  { label: "Clients Served", value: 40, suffix: "+" },
  { label: "Customer Satisfaction", value: 98, suffix: "%" },
  { label: "Founded", value: 2024, suffix: "" },
];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <div ref={ref}>{count}{suffix}</div>;
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: content } = useQuery({
    queryKey: ['public-site-content', 'hero'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('content').eq('section_key', 'hero').maybeSingle();
      if (error) throw error;
      return data?.content as Record<string, string> | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const headline = content?.headline || defaults.headline;
  const headlineAccent = content?.headline_accent || defaults.headline_accent;
  const subheadline = content?.subheadline || defaults.subheadline;
  const ctaText = content?.cta_text || defaults.cta_text;
  const ctaLink = content?.cta_link || defaults.cta_link;

  const services = [
    { icon: Code, label: "Custom Software" },
    { icon: Smartphone, label: "Mobile Apps" },
    { icon: Cloud, label: "Cloud Solutions" },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-nav">
      {/* Animated gradient background with parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_90%_25%)_0%,_hsl(220_40%_10%)_60%,_hsl(220_30%_6%)_100%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,_hsl(217_90%_60%)_0%,_transparent_50%),radial-gradient(circle_at_80%_70%,_hsl(217_90%_50%)_0%,_transparent_40%)]" />

        {/* Animated gradient blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(217_90%_40%/0.15)] blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[hsl(45_100%_55%/0.08)] blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(217_90%_50%/0.1)] blur-[120px]"
        />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[8%] h-20 w-20 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.03] backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-32 right-[6%] h-28 w-28 rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.03] backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-1/3 right-[15%] h-14 w-14 rounded-xl border border-primary-foreground/8 bg-primary-foreground/[0.02] rotate-12"
        />
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/3 left-[12%] h-10 w-10 rounded-lg border border-accent/10 bg-accent/[0.03]"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </motion.div>

      {/* Main content with parallax */}
      <motion.div style={{ y: textY, opacity }} className="relative z-10 container text-center px-4 pt-32 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/[0.07] px-5 py-2 text-sm font-medium text-primary-foreground/80 backdrop-blur-sm mb-8">
            <CheckCircle className="h-4 w-4 text-accent" />
            Trusted by 50+ Businesses Worldwide
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight max-w-5xl mx-auto"
        >
          <span className="text-primary-foreground">{headline}</span>{" "}
          <span className="text-accent relative">
            {headlineAccent}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-accent/40 rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl text-primary-foreground/65 max-w-2xl mx-auto leading-relaxed"
        >
          {subheadline}
        </motion.p>

        {/* Service pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {services.map((svc, i) => (
            <motion.span
              key={svc.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.05] px-4 py-2 text-sm text-primary-foreground/70 backdrop-blur-sm"
            >
              <svc.icon className="h-4 w-4 text-accent" />
              {svc.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="cta"
            size="lg"
            className="rounded-full px-8 text-base py-6 group shadow-[0_0_30px_hsl(45_100%_55%/0.3)] hover:shadow-[0_0_40px_hsl(45_100%_55%/0.5)] transition-all duration-300"
            asChild
          >
            <a href={ctaLink}>
              {ctaText}
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-base py-6 bg-primary-foreground text-nav font-semibold border-none hover:bg-primary-foreground/90 hover:text-nav hover:scale-105 transition-all duration-300"
            asChild
          >
            <a href="/portfolio">See Our Work</a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-base py-6 border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:border-primary-foreground/30 transition-all duration-300"
            asChild
          >
            <a href="/contact">Schedule a Demo</a>
          </Button>
        </motion.div>

        {/* Stats Counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
              className="flex flex-col items-center gap-1 p-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] backdrop-blur-sm"
            >
              <div className="text-2xl sm:text-3xl font-bold text-accent">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-primary-foreground/50 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/30 font-medium mb-6">
            Trusted by innovative companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {clientData.slice(0, 6).map((client, i) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.3 + i * 0.1 }}
                className="h-8 sm:h-10 opacity-30 hover:opacity-60 transition-opacity duration-300 cursor-default"
              >
                <img src={client.logo} alt={client.name} className="h-full w-auto object-contain brightness-0 invert" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group cursor-pointer"
      >
        <span className="text-xs uppercase tracking-widest text-primary-foreground/30 group-hover:text-primary-foreground/50 transition-colors">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-primary-foreground/40 group-hover:text-primary-foreground/60 transition-colors" />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default HeroSection;
