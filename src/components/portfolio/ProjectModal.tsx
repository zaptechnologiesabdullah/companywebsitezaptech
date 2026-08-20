import { ExternalLink, ArrowRight, Code, AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ProjectData } from "@/data/portfolioData";

interface ProjectModalProps {
  project: ProjectData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectModal = ({ project, open, onOpenChange }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl border-none">
        {/* Header Image */}
        <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden rounded-t-xl">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-10 sm:bottom-4 sm:left-6 sm:right-6">
            <span className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-accent bg-foreground/40 backdrop-blur-sm px-2.5 py-1 rounded-full mb-1.5">
              {project.category}
            </span>
            <DialogTitle className="text-base sm:text-2xl font-bold text-primary-foreground leading-snug">
              {project.title}
            </DialogTitle>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-1.5 sm:mb-2">Project Overview</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{project.fullDescription}</p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Technologies Used
            </h3>
            <div className="space-y-3">
              {project.technologies.languages.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Languages & Frameworks</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.languages.map((lang) => (
                      <span key={lang} className="text-[10px] sm:text-xs font-medium bg-primary/10 text-primary px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.technologies.tools.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2">Tools & Platforms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.tools.map((tool) => (
                      <span key={tool} className="text-[10px] sm:text-xs font-medium bg-secondary text-foreground border border-border px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Challenge & Solution */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                <h4 className="font-bold text-foreground text-xs sm:text-sm">Challenge</h4>
              </div>
              <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{project.challenge}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <Lightbulb className="h-4 w-4 text-accent-foreground shrink-0" />
                <h4 className="font-bold text-foreground text-xs sm:text-sm">Solution</h4>
              </div>
              <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
            </div>
          </div>

          {/* Results */}
          <div>
            <h3 className="font-bold text-foreground text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Results & Impact
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {project.results.map((result) => (
                <div key={result} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-muted-foreground">{result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            {project.projectLink && (
              <Button size="default" className="group text-xs sm:text-sm w-full sm:w-auto" asChild>
                <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit the Project
                </a>
              </Button>
            )}
            <Button variant="cta" size="default" className="group text-xs sm:text-sm w-full sm:w-auto" asChild>
              <a href="/contact">
                Start Your Project
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
