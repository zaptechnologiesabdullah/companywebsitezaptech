import { 
  Globe, Smartphone, Palette, Wrench, PenTool, Megaphone, Search, BrainCircuit, Bot,
  ArrowRight, CheckCircle2, type LucideIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ServiceDetail {
  icon: LucideIcon;
  title: string;
  slug: string;
  intro: string;
  features: string[];
  process: { step: string; desc: string }[];
}

const servicesData: ServiceDetail[] = [
  {
    icon: Globe,
    title: "Web Development",
    slug: "web-development",
    intro: "We build dynamic, high-performance websites that help businesses grow by enhancing their online presence. Our web development team utilizes cutting-edge technologies to ensure scalability, speed, and user engagement.",
    features: [
      "Responsive web design",
      "Custom website development",
      "E-commerce solutions",
      "SEO optimization",
      "Scalable and secure architecture",
    ],
    process: [
      { step: "Discovery & Planning", desc: "We analyze your goals, audience, and competitors to create a detailed roadmap." },
      { step: "Design & Development", desc: "Our team crafts pixel-perfect designs and develops robust, clean code." },
      { step: "Testing & Deployment", desc: "Rigorous QA across devices and browsers before a smooth launch." },
      { step: "Ongoing Support", desc: "Continuous monitoring, updates, and optimization post-launch." },
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    slug: "mobile-app-development",
    intro: "We create intuitive, feature-rich mobile applications for iOS and Android that deliver seamless user experiences and drive business growth through mobile-first strategies.",
    features: [
      "Native iOS & Android development",
      "Cross-platform solutions (React Native, Flutter)",
      "UI/UX optimized for mobile",
      "Push notifications & real-time features",
      "App Store & Play Store deployment",
    ],
    process: [
      { step: "Concept & Strategy", desc: "We define your app's core value proposition and target audience." },
      { step: "Wireframing & Design", desc: "Interactive prototypes and polished UI designs before development." },
      { step: "Development & Integration", desc: "Agile sprints with continuous integration and API development." },
      { step: "Launch & Iteration", desc: "Store submission, user feedback collection, and iterative improvements." },
    ],
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    slug: "ui-ux-design",
    intro: "We design intuitive, visually stunning interfaces that delight users and drive conversions. Our human-centered design approach ensures every interaction feels natural and purposeful.",
    features: [
      "User research & persona development",
      "Wireframing & interactive prototyping",
      "Visual design & brand consistency",
      "Usability testing & iteration",
      "Design system creation",
    ],
    process: [
      { step: "Research & Discovery", desc: "Deep-dive into user needs, behaviors, and pain points." },
      { step: "Ideation & Wireframes", desc: "Low-fidelity wireframes to validate concepts quickly." },
      { step: "Visual Design", desc: "High-fidelity mockups with your brand identity woven in." },
      { step: "Testing & Handoff", desc: "User testing, refinement, and developer-ready design specs." },
    ],
  },
  {
    icon: Wrench,
    title: "Website Maintenance & Services",
    slug: "website-maintenance",
    intro: "Keep your website running at peak performance with our comprehensive maintenance services. We handle updates, security, backups, and optimization so you can focus on your business.",
    features: [
      "Regular security updates & patches",
      "Performance monitoring & optimization",
      "Content updates & management",
      "Backup & disaster recovery",
      "Uptime monitoring & reporting",
    ],
    process: [
      { step: "Audit & Assessment", desc: "We evaluate your site's current health and identify issues." },
      { step: "Maintenance Plan", desc: "A tailored plan covering updates, backups, and monitoring." },
      { step: "Ongoing Execution", desc: "Scheduled maintenance with minimal downtime." },
      { step: "Reporting & Review", desc: "Monthly reports on performance, uptime, and improvements." },
    ],
  },
  {
    icon: PenTool,
    title: "Graphic Design",
    slug: "graphic-design",
    intro: "From brand identity to marketing collateral, we create stunning visual designs that communicate your brand story and make a lasting impression on your audience.",
    features: [
      "Logo & brand identity design",
      "Marketing materials & print design",
      "Social media graphics",
      "Infographics & data visualization",
      "Packaging design",
    ],
    process: [
      { step: "Brief & Research", desc: "Understanding your brand, goals, and target market." },
      { step: "Concept Development", desc: "Multiple creative directions for you to choose from." },
      { step: "Refinement", desc: "Iterating on the chosen concept until it's perfect." },
      { step: "Final Delivery", desc: "Production-ready files in all required formats." },
    ],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    slug: "digital-marketing",
    intro: "Drive measurable growth with data-driven digital marketing strategies. We help you reach the right audience, at the right time, with the right message across all digital channels.",
    features: [
      "Social media marketing & management",
      "Pay-per-click (PPC) advertising",
      "Email marketing campaigns",
      "Content marketing strategy",
      "Analytics & conversion optimization",
    ],
    process: [
      { step: "Audit & Strategy", desc: "Analyzing your current presence and crafting a growth roadmap." },
      { step: "Campaign Setup", desc: "Building targeted campaigns across chosen channels." },
      { step: "Execution & Optimization", desc: "Running campaigns with continuous A/B testing and optimization." },
      { step: "Reporting & Scale", desc: "Detailed performance reports and scaling winning strategies." },
    ],
  },
  {
    icon: Search,
    title: "Search Engine Optimisation",
    slug: "seo",
    intro: "Boost your organic visibility and drive qualified traffic with our comprehensive SEO services. We use proven strategies to improve your rankings and grow your online presence.",
    features: [
      "Technical SEO audit & fixes",
      "Keyword research & strategy",
      "On-page & off-page optimization",
      "Local SEO & Google Business Profile",
      "SEO performance tracking & reporting",
    ],
    process: [
      { step: "SEO Audit", desc: "Comprehensive analysis of your site's technical and content SEO health." },
      { step: "Strategy & Keywords", desc: "Identifying high-value keywords and creating an optimization plan." },
      { step: "Implementation", desc: "On-page optimization, content creation, and link building." },
      { step: "Monitor & Improve", desc: "Tracking rankings, traffic, and continuously refining the strategy." },
    ],
  },
  {
    icon: Bot,
    title: "AI Based App",
    slug: "ai-based-app",
    intro: "Leverage the power of artificial intelligence to build intelligent applications that automate processes, enhance decision-making, and deliver personalized user experiences.",
    features: [
      "Custom AI/ML model development",
      "Natural language processing (NLP)",
      "Computer vision solutions",
      "Chatbots & virtual assistants",
      "Predictive analytics integration",
    ],
    process: [
      { step: "Use Case Discovery", desc: "Identifying where AI can create the most impact for your business." },
      { step: "Data & Model Design", desc: "Preparing data pipelines and designing ML architectures." },
      { step: "Development & Training", desc: "Building and training models with rigorous validation." },
      { step: "Deployment & Monitoring", desc: "Production deployment with performance monitoring and retraining." },
    ],
  },
  {
    icon: BrainCircuit,
    title: "AI Based SaaS Products",
    slug: "ai-based-saas",
    intro: "We build scalable, AI-powered SaaS platforms that transform industries. From ideation to launch, we deliver intelligent software products that generate recurring revenue and solve real problems.",
    features: [
      "Multi-tenant SaaS architecture",
      "AI-powered features & automation",
      "Subscription & billing integration",
      "Scalable cloud infrastructure",
      "Analytics dashboards & reporting",
    ],
    process: [
      { step: "Product Strategy", desc: "Market research, competitive analysis, and product-market fit validation." },
      { step: "MVP Development", desc: "Rapid development of a minimum viable product to test assumptions." },
      { step: "AI Integration", desc: "Embedding intelligent features that differentiate your product." },
      { step: "Scale & Grow", desc: "Infrastructure scaling, user onboarding, and feature iteration." },
    ],
  },
];

const ServiceDetailSection = ({ service, index }: { service: ServiceDetail; index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <div id={service.title.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-24">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${isEven ? "" : "lg:direction-rtl"}`}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={isEven ? "" : "lg:order-2"}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <service.icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{service.title}</h3>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">{service.intro}</p>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {service.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <Button variant="cta" className="group relative z-10" asChild>
            <a href={`/services/${service.slug}`} onClick={(e) => { e.stopPropagation(); window.location.href = `/services/${service.slug}`; }}>
              Learn More
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={isEven ? "" : "lg:order-1"}
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-4">Our Process</p>
          <div className="space-y-4">
            {service.process.map((step, i) => (
              <div
                key={step.step}
                className="flex gap-4 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-md hover:border-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{step.step}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ServiceDetails = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold tracking-widest uppercase text-primary mb-2"
          >
            In-Depth
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground"
          >
            Our Expertise, Explained
          </motion.h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-accent" />
        </div>

        <div className="max-w-6xl mx-auto space-y-24">
          {servicesData.map((service, i) => (
            <ServiceDetailSection key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
