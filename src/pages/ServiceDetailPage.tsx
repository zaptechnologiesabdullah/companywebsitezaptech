import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { servicePages } from "@/data/serviceDetailData";

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicePages.find((s) => s.slug === slug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-background" style={{ width: 90 + i * 50, height: 90 + i * 50, top: `${10 + i * 20}%`, right: `${5 + i * 12}%` }} animate={{ y: [0, -18, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5 + i, repeat: Infinity }} />
          ))}
        </div>
        <div className="container px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-background/20 flex items-center justify-center">
                  <service.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <Badge className="bg-background/20 text-primary-foreground border-0">Our Service</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">{service.seoTitle}</h1>
              <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 leading-relaxed">{service.heroIntro}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="cta" size="lg" className="rounded-full px-8" asChild>
                  <a href="/contact">Get a Free Quote <ArrowRight className="w-4 h-4 ml-2" /></a>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 bg-primary-foreground text-nav font-semibold border-none hover:bg-primary-foreground/90" asChild>
                   <a href="/pricing">View Pricing</a>
                 </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={service.heroImage} alt={service.title} className="w-full h-[360px] object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-foreground mb-2">What We Offer</h2>
            <div className="w-14 h-1 rounded-full bg-accent mb-6" />
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">{service.whatWeOffer}</p>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Why Choose Our {service.title}?</h2>
            <div className="w-14 h-1 rounded-full bg-accent mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {service.benefits.map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all">
                <CheckCircle2 className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Technologies We Use</h2>
            <div className="w-14 h-1 rounded-full bg-accent mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {service.technologies.map((tech, i) => (
              <motion.div key={tech.category} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">{tech.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {tech.items.map((item) => (
                    <Badge key={item} variant="outline" className="text-xs font-medium">{item}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-2">Our Success Stories</h2>
            <p className="text-muted-foreground">Real projects, real results</p>
            <div className="w-14 h-1 rounded-full bg-accent mx-auto mt-4" />
          </div>
          <div className="max-w-5xl mx-auto space-y-8">
            {service.caseStudies.map((cs, i) => (
              <motion.div key={cs.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-2">
                    <img src={cs.image} alt={cs.title} className="w-full h-48 lg:h-full object-cover" />
                  </div>
                  <div className="lg:col-span-3 p-6 sm:p-8">
                    <Badge className="bg-primary/10 text-primary border-0 mb-3">{cs.client}</Badge>
                    <h3 className="text-xl font-bold text-foreground mb-4">{cs.title}</h3>
                    <div className="space-y-3 mb-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Challenge</p>
                        <p className="text-sm text-muted-foreground">{cs.challenge}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Solution</p>
                        <p className="text-sm text-muted-foreground">{cs.solution}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Results</p>
                      <div className="flex flex-wrap gap-2">
                        {cs.results.map((r) => (
                          <Badge key={r} className="bg-accent/20 text-accent-foreground border-0 text-xs">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {service.faqs.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {service.faqs.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="font-semibold text-foreground text-sm sm:text-base pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                  </button>
                  {openFaq === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Project?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Ready to take your {service.title.toLowerCase()} to the next level? Contact us today for a free consultation and quote!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="cta" size="lg" className="rounded-full px-8" asChild>
                <a href="/contact">Contact Us <ArrowRight className="w-4 h-4 ml-2" /></a>
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="/pricing">Request a Quote</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
