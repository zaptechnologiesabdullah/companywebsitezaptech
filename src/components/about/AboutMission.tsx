import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";
import teamAbdullah from "@/assets/team-abdullah.png";

const AboutMission = () => {
  return (
    <section id="mission" className="py-24 bg-background">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-[340px] h-[420px] sm:w-[400px] sm:h-[480px] rounded-3xl overflow-hidden border-4 border-accent/20 shadow-xl bg-gradient-to-b from-primary/10 to-primary/5">
              <img
                src={teamAbdullah}
                alt="Abdullah Munaim - CEO & Founder, Zap Technologies"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold tracking-widest uppercase text-primary mb-2"
            >
              Our Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
            >
              Empowering Businesses Through Technology
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground leading-relaxed mb-8"
            >
              Founded with a passion for innovation, Zap Technologies has grown into a trusted technology partner for startups and enterprises alike. We combine deep technical expertise with a genuine understanding of business challenges to deliver solutions that make a real difference.
            </motion.p>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Our Mission</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To deliver innovative, reliable, and scalable technology solutions that help businesses thrive in the digital age.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Our Vision</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To be the go-to technology partner for businesses worldwide, recognized for innovation, quality, and lasting impact.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMission;
