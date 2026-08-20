import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutTeam from "@/components/about/AboutTeam";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-background"
              style={{ width: 90 + i * 50, height: 90 + i * 50, top: `${10 + i * 20}%`, right: `${5 + i * 12}%` }}
              animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5 + i, repeat: Infinity }}
            />
          ))}
        </div>
        <div className="container px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-background/20 text-primary-foreground border-0 mb-4">Our Team</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Meet Our Team
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-base sm:text-lg">
              The talented minds behind our success — passionate professionals dedicated to delivering excellence in every project.
            </p>
          </motion.div>
        </div>
      </section>

      <AboutTeam />
      <Footer />
    </div>
  );
};

export default Team;
