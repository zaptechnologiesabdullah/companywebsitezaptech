import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Rocket, Zap } from "lucide-react";

const defaults = {
  heading: "Ready to Start Your",
  heading_accent: "Next Project?",
  description: "Transform your ideas into powerful digital solutions. Book a free consultation with our experts today.",
  button_text: "Get a Free Consultation",
  button_link: "/contact",
};

const CTASection = () => {
  const { data: content } = useQuery({
    queryKey: ['public-site-content', 'cta'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('content').eq('section_key', 'cta').maybeSingle();
      if (error) throw error;
      return data?.content as Record<string, string> | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const heading = content?.heading || defaults.heading;
  const description = content?.description || defaults.description;
  const buttonText = content?.button_text || defaults.button_text;
  const buttonLink = content?.button_link || defaults.button_link;

  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(230,70%,30%)]" />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-12 left-[10%] h-24 w-24 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm" />
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-16 right-[8%] h-32 w-32 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm" />
        <motion.div animate={{ y: [0, 15, 0], x: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-1/3 right-[20%] h-16 w-16 rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm rotate-12" />
        <motion.div animate={{ y: [0, -12, 0], x: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-1/4 left-[25%] h-20 w-20 rounded-full border border-primary-foreground/8 bg-primary-foreground/[0.03]" />
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm mb-8">
              <Sparkles className="h-4 w-4 text-accent" /> Let's Build Something Great
            </span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
            {heading}{" "}
            <span className="text-accent">{content?.heading_accent || defaults.heading_accent}</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg sm:text-xl text-primary-foreground/70 max-w-xl mx-auto mb-10">
            {description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="cta" size="lg" className="text-base px-8 py-6 group" asChild>
              <a href={buttonLink}>
                <Rocket className="h-5 w-5 mr-2" />
                {buttonText}
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button size="lg" className="text-base px-8 py-6 bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 shadow-md" asChild>
              <a href="/portfolio">View Our Work</a>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/50">
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-accent" /> Fast Turnaround</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-primary-foreground/20" />
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> 80+ Projects Delivered</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-primary-foreground/20" />
            <span className="flex items-center gap-2"><Rocket className="h-4 w-4 text-accent" /> 100% Satisfaction</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
