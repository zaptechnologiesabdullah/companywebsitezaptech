import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { projects, categories, type ProjectData, type Category } from "@/data/portfolioData";
import ProjectModal from "@/components/portfolio/ProjectModal";
import Header from "@/components/Header";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const openProject = (project: ProjectData) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative py-32 sm:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(230,70%,30%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[10%] h-24 w-24 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm"
          />
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-20 right-[8%] h-28 w-28 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />

        <div className="container px-4 relative z-10 text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest uppercase text-accent mb-3"
          >
            Our Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Featured Projects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/70 leading-relaxed"
          >
            Explore our portfolio of successful projects across web, mobile, AI, and cloud — each crafted to deliver real business impact.
          </motion.p>
        </div>
      </section>

      {/* Category Tabs + Projects Grid */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
                {cat !== "All" && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({projects.filter((p) => p.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project, i) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    index={i}
                    onClick={() => openProject(project)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
            <Button variant="cta" size="lg" className="rounded-full px-8 text-base group">
              Contact Us for Your Next Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />

      <ProjectModal project={selectedProject} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

const ProjectCard = ({
  project,
  index,
  onClick,
}: {
  project: ProjectData;
  index: number;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
            {project.category}
          </span>
          <h3 className="text-lg font-bold text-primary-foreground mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-primary-foreground/80 leading-relaxed line-clamp-2">
            {project.description}
          </p>
          <p className="text-xs text-accent font-semibold mt-3">Click to view details →</p>
        </div>
      </div>
      <div className="p-4 transition-opacity duration-300 group-hover:opacity-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {project.category}
        </span>
        <h3 className="text-base font-bold text-card-foreground mt-1">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
};

export default Portfolio;
