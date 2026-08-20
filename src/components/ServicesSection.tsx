import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Globe, Smartphone, Palette, Wrench, PenTool, Megaphone, Search, BrainCircuit, Bot, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const services = [
  { icon: Globe, title: "Web Development", slug: "web-development", description: "Responsive websites designed to convert visitors into loyal customers.", accent: "from-blue-500/20 to-cyan-500/20" },
  { icon: Smartphone, title: "Mobile App Development", slug: "mobile-app-development", description: "Seamless apps for iOS and Android that users love.", accent: "from-violet-500/20 to-purple-500/20" },
  { icon: Palette, title: "UI/UX Design", slug: "ui-ux-design", description: "Intuitive and beautiful interfaces that delight users.", accent: "from-pink-500/20 to-rose-500/20" },
  { icon: Wrench, title: "Website Maintenance", slug: "website-maintenance", description: "Reliable upkeep and support to keep your site running smoothly.", accent: "from-emerald-500/20 to-green-500/20" },
  { icon: PenTool, title: "Graphic Design", slug: "graphic-design", description: "Stunning visuals and branding that make a lasting impression.", accent: "from-orange-500/20 to-amber-500/20" },
  { icon: Megaphone, title: "Digital Marketing", slug: "digital-marketing", description: "Data-driven campaigns that grow your reach and revenue.", accent: "from-red-500/20 to-orange-500/20" },
  { icon: Search, title: "SEO", slug: "seo", description: "Boost your rankings and drive organic traffic to your site.", accent: "from-teal-500/20 to-cyan-500/20" },
  { icon: Bot, title: "AI Based App", slug: "ai-based-app", description: "Intelligent applications powered by cutting-edge AI technology.", accent: "from-indigo-500/20 to-blue-500/20" },
  { icon: BrainCircuit, title: "AI Based SaaS", slug: "ai-based-saas", description: "Scalable AI-driven software solutions for modern businesses.", accent: "from-fuchsia-500/20 to-purple-500/20" },
];

const defaults = {
  title: "Our Services",
  description: "At Zap Technologies, we specialize in delivering cutting-edge software development, cloud-based solutions, and IT consulting services to help businesses accelerate growth and innovation.",
};

const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data: content } = useQuery({
    queryKey: ['public-site-content', 'services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('content').eq('section_key', 'services').maybeSingle();
      if (error) throw error;
      return data?.content as Record<string, string> | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const title = content?.title || defaults.title;
  const description = content?.description || defaults.description;

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">What We Offer</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg leading-relaxed"
          >
            {description}
          </motion.p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.a
              key={service.title}
              href={`/services/${service.slug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative rounded-2xl border border-border bg-card p-6 sm:p-7 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden block"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Decorative corner element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Icon + Arrow row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25 group-hover:scale-110">
                    <service.icon className="h-5 w-5" />
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border border-border text-muted-foreground opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-card-foreground mb-2 group-hover:text-foreground transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-5 h-0.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="cta" size="lg" className="rounded-full px-8 text-base group" asChild>
            <a href="/contact">
              Get a Quote
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8 text-base" asChild>
            <a href="/services">Explore All Services</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
