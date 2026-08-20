import { motion } from "framer-motion";
import { Users, Cpu, Trophy, LifeBuoy } from "lucide-react";

const usps = [
  {
    icon: Users,
    title: "Customer-Centric Approach",
    description: "We focus on understanding your business needs and delivering tailored tech solutions that drive real results.",
  },
  {
    icon: Cpu,
    title: "Expertise in Technology",
    description: "Our team is skilled in the latest technologies and methodologies to provide innovative, future-proof solutions.",
  },
  {
    icon: Trophy,
    title: "Proven Track Record",
    description: "With a strong portfolio of successful projects across industries, we deliver outcomes that matter.",
  },
  {
    icon: LifeBuoy,
    title: "End-to-End Support",
    description: "From strategy to execution and beyond, we offer full support throughout the entire development lifecycle.",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(230,70%,30%)]" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[6%] h-24 w-24 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 18, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-16 right-[10%] h-20 w-20 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm rotate-12"
        />
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px]" />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-widest uppercase text-accent mb-2"
          >
            Why Choose Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground"
          >
            Why Zap Technologies?
          </motion.h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-accent" />
        </div>

        {/* USP Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {usps.map((usp, i) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-5 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/10 hover:border-primary-foreground/20"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <usp.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-primary-foreground text-lg mb-2">{usp.title}</h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">{usp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
