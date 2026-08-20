import { useState } from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, Globe, ChevronDown, ChevronUp, Users, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import teamAbdullah from "@/assets/team-abdullah.png";
import teamKamran from "@/assets/team-kamran.png";
import teamHasnain from "@/assets/team-hasnain.png";
import teamSalman from "@/assets/team-salman.png";

const team = [
  {
    name: "Abdullah Munaim",
    role: "CEO & Founder",
    initials: "AM",
    photo: teamAbdullah,
    bio: "Abdullah leads Zap Technologies with a vision for innovative solutions and customer-focused strategies. He has built the company from the ground up, driving growth through strategic leadership, technical expertise, and a deep understanding of the digital landscape.",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Muhammad Kamran Khan",
    role: "Marketing Manager",
    initials: "MK",
    photo: teamKamran,
    bio: "Kamran drives brand growth and digital marketing strategies at Zap Technologies. With a sharp eye for market trends and consumer behavior, he crafts compelling campaigns that connect audiences with our innovative solutions.",
    socials: { linkedin: "#" },
  },
  {
    name: "Muhammad Hasnain",
    role: "Mobile App Developer & Flutter Dev",
    initials: "MH",
    photo: teamHasnain,
    bio: "Hasnain specializes in cross-platform mobile app development using Flutter and Dart. With a keen eye for smooth UI/UX and performance optimization, he builds beautiful, high-performance mobile applications for both iOS and Android platforms.",
    socials: { linkedin: "#" },
  },
  {
    name: "Muhammad Salman",
    role: "Front End Developer",
    initials: "MS",
    photo: teamSalman,
    bio: "Salman is a skilled front-end developer with expertise in modern JavaScript frameworks and responsive design. He transforms creative designs into pixel-perfect, interactive web experiences with clean, maintainable code and attention to detail.",
    socials: { linkedin: "#" },
  },
];

const BIO_LIMIT = 120;

const TeamCard = ({ member, index }: { member: typeof team[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = member.bio.length > BIO_LIMIT;
  const displayBio = expanded || !needsTruncation ? member.bio : member.bio.slice(0, BIO_LIMIT) + "…";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group relative text-center rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30"
    >
      {/* Avatar placeholder – will be replaced with photos later */}
      {member.photo ? (
        <img src={member.photo} alt={member.name} className="mx-auto mb-6 h-24 w-24 rounded-full object-cover object-top transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-primary/20" />
      ) : (
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold tracking-wide transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-primary/20">
          {member.initials}
        </div>
      )}

      <h3 className="font-bold text-foreground text-lg mb-1">{member.name}</h3>
      <p className="text-sm text-primary font-semibold mb-4">{member.role}</p>

      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
        {displayBio}
      </p>

      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1 mb-4"
        >
          {expanded ? <>See Less <ChevronUp className="w-3 h-3" /></> : <>See More <ChevronDown className="w-3 h-3" /></>}
        </button>
      )}

      {/* Social links */}
      <div className="flex justify-center gap-3 mt-2">
        {member.socials.linkedin && (
          <a href={member.socials.linkedin} className="text-muted-foreground/50 hover:text-primary transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {member.socials.twitter && (
          <a href={member.socials.twitter} className="text-muted-foreground/50 hover:text-primary transition-colors" aria-label="Twitter">
            <Twitter className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

const AboutTeam = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container px-4">
        {/* Section header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-widest uppercase text-primary mb-2"
          >
            The Talented Minds Behind Our Success
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground"
          >
            Meet Our Team
          </motion.h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-accent" />
        </div>

        {/* Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="text-center text-muted-foreground max-w-2xl mx-auto mb-16 text-base sm:text-lg leading-relaxed"
        >
          We're a passionate team of professionals dedicated to delivering excellence in every project. From innovative ideas to flawless execution, meet the people who make it all happen.
        </motion.p>

        {/* Expertise headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-foreground">Our Expertise in Action</h3>
        </motion.div>

        {/* Team cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {team.map((member, i) => (
            <TeamCard key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* CEO quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 max-w-3xl mx-auto text-center"
        >
          <Quote className="w-8 h-8 text-accent mx-auto mb-4" />
          <blockquote className="text-lg sm:text-xl italic text-foreground/80 leading-relaxed mb-4">
            "Our people are our strength – together, we achieve excellence."
          </blockquote>
          <p className="text-sm font-semibold text-primary">— Abdullah Munaim, CEO & Founder</p>
        </motion.div>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 bg-primary/5 rounded-2xl p-8 sm:p-10 border border-primary/10">
            <h3 className="text-xl font-bold text-foreground">Want to Join Our Team?</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              We're always looking for talented individuals to join our growing team. If you're passionate about technology, we'd love to hear from you.
            </p>
            <Button variant="cta" className="rounded-full px-8" asChild>
              <a href="/contact">
                Work With Us <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutTeam;
