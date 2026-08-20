import { motion } from "framer-motion";
import { Award, Star, BadgeCheck, Quote, Users, Rocket } from "lucide-react";

const achievements = [
  { icon: Rocket, title: "Founded in 2024", description: "Started with a mission to deliver high-quality digital solutions for growing businesses." },
  { icon: Star, title: "80+ Projects Delivered", description: "Successfully completed projects across web development, mobile apps, SEO, and AI solutions." },
  { icon: Users, title: "6+ Team Members", description: "A growing team of skilled developers, designers, and marketing experts working together." },
  { icon: BadgeCheck, title: "Client Satisfaction", description: "Consistently rated 5 stars by clients for quality, communication, and timely delivery." },
];

const testimonials = [
  { quote: "Zap Technologies built us a professional website that truly represents our brand. Their team was responsive and delivered on time.", name: "Ahmed Raza", role: "Founder, Raza Enterprises" },
  { quote: "The SEO and Meta Ads campaigns by Zap helped us double our online leads within just two months. Highly recommended!", name: "Usman Ali", role: "Owner, Ali Digital Store" },
];

const AboutAchievements = () => {
  return (
    <section className="py-24 bg-secondary/40">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-widest uppercase text-primary mb-2"
          >
            What We've Achieved
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground"
          >
            Our Success Stories
          </motion.h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-accent" />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {achievements.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-foreground text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAchievements;
