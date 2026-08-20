import { SearchCheck, PenLine, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import teamAbdullah from "@/assets/team-abdullah.png";

const features = [
  {
    icon: SearchCheck,
    title: "Product & Market Understanding",
    description:
      "We analyze your business goals and users to build digital solutions that actually fit your market.",
  },
  {
    icon: PenLine,
    title: "Design & Development",
    description:
      "We design and develop modern websites and mobile apps that are fast, secure, and easy to scale.",
  },
  {
    icon: Rocket,
    title: "Launch & Growth",
    description:
      "We help you launch confidently and grow with ongoing support, marketing, and optimization.",
  },
];

const AboutSection = () => {
  return (
    <section className="py-28 bg-secondary/40">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-[340px] h-[420px] sm:w-[400px] sm:h-[500px] rounded-full overflow-hidden flex items-end justify-center border-4 border-primary/30 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5">
                <img
                  src={teamAbdullah}
                  alt="Abdullah Munaim - CEO & Founder, Zap Technologies"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </motion.div>

          {/* Right — Text + Cards */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-sm font-semibold tracking-widest uppercase text-primary mb-2"
            >
              Welcome to Zap Technologies
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4"
            >
              Building Websites & Apps That Help Your Business{" "}
              <span className="text-primary">Grow</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground leading-relaxed mb-8"
            >
              Welcome to Zap Technologies, a technology partner helping startups
              and businesses build websites, mobile apps, and reliable digital
              solutions.
            </motion.p>

            <div className="space-y-5">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
