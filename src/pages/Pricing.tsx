import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, Star, ArrowRight, Send, CreditCard, Clock, DollarSign, ChevronDown, ChevronUp, Zap, Globe, Smartphone, Headphones, Loader2, Paperclip, Link, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

/* ─── Fallback static data (used when DB is empty) ─── */
const fallbackWebPackages = [
  { name: "Starter", description: "Best for small businesses & personal websites", price: "From $100", delivery_time: "3–5 days", features: ["1–3 page website", "Responsive design (mobile friendly)", "Basic contact form", "Basic SEO setup", "Speed optimization (basic)", "1 revision"], sort_order: 0 },
  { name: "Business", description: "For startups and growing businesses", price: "$300 – $600", delivery_time: "5–10 days", features: ["Up to 7 pages", "Custom design layout", "Mobile & tablet responsive", "On-page SEO optimization", "Blog / CMS setup", "Basic analytics integration", "Speed optimization", "3 revisions"], sort_order: 1 },
  { name: "Professional", description: "For companies and full online presence", price: "$900 – $1,500", delivery_time: "10–20 days", features: ["Up to 15 pages", "Full custom UI/UX design", "Advanced SEO structure", "E-commerce integration", "Payment gateway setup", "Performance optimization", "Security setup", "Analytics & tracking", "Unlimited revisions"], sort_order: 2 },
];

const fallbackMobilePackages = [
  { name: "Starter App", description: "Perfect for small businesses or MVPs", price: "From $150", delivery_time: "2–3 weeks", features: ["Single platform (iOS or Android)", "Basic UI/UX design", "Core functionality (1–3 features)", "App store submission assistance", "1 revision"], sort_order: 0 },
  { name: "Business App", description: "For startups and growing businesses", price: "$400 – $700", delivery_time: "3–6 weeks", features: ["Single or dual platform (iOS & Android)", "Custom UI/UX design", "Up to 5 features / screens", "Push notifications", "API integration (basic)", "Analytics integration", "2–3 revisions"], sort_order: 1 },
  { name: "Professional App", description: "For companies and full-scale applications", price: "$900 – $1,500+", delivery_time: "6–10 weeks", features: ["Multi-platform (iOS & Android)", "Full custom design", "User authentication & management", "Up to 10–15 screens/features", "Payment gateway & integrations", "Push notifications & analytics dashboard", "Performance optimization & security setup", "Unlimited revisions"], sort_order: 2 },
];

const fallbackConsultingPackages = [
  { name: "Hourly Consulting", price: "$12/hour", description: "Ideal for short-term advisory, code reviews, and strategy sessions.", features: ["Personalized tech guidance", "Quick solutions for code, software, or infrastructure", "Flexible scheduling"], delivery_time: null, sort_order: 0 },
  { name: "Project-Based Consulting", price: "Based on requirements", description: "Ideal for business IT audits, software recommendations, strategy planning, and technology roadmaps.", features: ["Full project evaluation", "Custom solutions based on company needs", "Optional ongoing support"], delivery_time: null, sort_order: 1 },
];

const paymentTerms = [
  { icon: DollarSign, title: "Upfront Deposit", desc: "For most projects, we require a 30% upfront deposit before work begins." },
  { icon: Clock, title: "Milestone Payments", desc: "For project-based work, payments are tied to clear milestones throughout the development process." },
  { icon: CreditCard, title: "Accepted Methods", desc: "We accept bank transfers, PayPal, credit cards, and other major payment methods." },
];

const faqs = [
  { q: "What is included in the pricing?", a: "Our pricing covers design, development, testing, and launch of your project. Any additional features or services will be discussed and billed separately." },
  { q: "Do you offer discounts for long-term projects?", a: "Yes! We offer discounts for long-term engagements or recurring projects. Contact us to discuss the specifics." },
  { q: "What happens if I change the scope after we start?", a: "We will discuss any changes and adjust the timeline or price accordingly, ensuring both parties are aligned before proceeding." },
  { q: "Can I pay in installments?", a: "Yes, for larger projects we offer payment plans with milestones to help manage your budget effectively." },
  { q: "Is there a refund policy?", a: "We offer refunds for work not yet started. Once development begins, refunds are prorated based on completed milestones." },
];

type PkgDisplay = {
  name: string; price: string; description: string | null;
  features: string[]; delivery_time: string | null; sort_order: number;
  popular?: boolean;
};

const PricingCard = ({ pkg, index }: { pkg: PkgDisplay; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className={`relative rounded-2xl border p-6 sm:p-8 flex flex-col ${
      pkg.popular
        ? "border-primary bg-primary/[0.03] shadow-lg ring-2 ring-primary/20"
        : "border-border bg-card"
    }`}
  >
    {pkg.popular && (
      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground border-0 px-4">
        <Star className="w-3 h-3 mr-1" /> Most Popular
      </Badge>
    )}
    <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
    <p className="text-sm text-muted-foreground mt-1 mb-4">{pkg.description}</p>
    <p className="text-3xl font-bold text-primary mb-1">{pkg.price}</p>
    {pkg.delivery_time && <p className="text-xs text-muted-foreground mb-6 flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg.delivery_time}</p>}
    <ul className="space-y-3 mb-8 flex-1">
      {pkg.features.map((f) => (
        <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
          <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {f}
        </li>
      ))}
    </ul>
    <Button variant={pkg.popular ? "cta" : "outline"} className="rounded-full w-full" asChild>
      <a href="/contact">Get Started</a>
    </Button>
  </motion.div>
);

const Pricing = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", service: "", scope: "", budget: "", timeline: "", projectLink: "" });
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10 MB.", variant: "destructive" });
      e.target.value = '';
      return;
    }
    setFile(selected);
  };

  const webPackages: PkgDisplay[] = fallbackWebPackages.map((p, i) => ({ ...p, popular: i === 1 }));
  const mobilePackages: PkgDisplay[] = fallbackMobilePackages.map((p, i) => ({ ...p, popular: i === 1 }));
  const consultingPackages = fallbackConsultingPackages.map(p => ({ name: p.name, price: p.price, desc: p.description || '', features: p.features }));

  const submitMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      let attachmentUrl: string | null = null;

      // Upload file if present
      if (file) {
        const ext = file.name.split('.').pop();
        const filePath = `pricing-quotes/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('form-attachments').upload(filePath, file);
        if (uploadError) throw new Error('File upload failed: ' + uploadError.message);
        const { data: urlData } = supabase.storage.from('form-attachments').getPublicUrl(filePath);
        attachmentUrl = urlData.publicUrl;
      }

      const messageParts = [
        data.scope ? `Scope: ${data.scope}` : '',
        data.budget ? `Budget: ${data.budget}` : '',
        data.timeline ? `Timeline: ${data.timeline}` : '',
      ].filter(Boolean).join('\n');

      const { error } = await supabase.from('form_queries').insert({
        name: data.name,
        email: data.email,
        subject: `Quote Request: ${data.service || 'General'}`,
        message: messageParts,
        project_link: data.projectLink || null,
        attachment_url: attachmentUrl,
      } as any);
      if (error) throw error;

      try {
        await supabase.functions.invoke('send-contact-email', {
          body: {
            name: data.name, email: data.email,
            subject: `Quote Request: ${data.service || 'General'}`,
            message: messageParts + (data.projectLink ? `\nProject Link: ${data.projectLink}` : '') + (attachmentUrl ? `\nAttachment: ${attachmentUrl}` : ''),
          },
        });
      } catch {}
    },
    onSuccess: () => {
      toast({ title: "Quote request received!", description: "We'll review your requirements and get back to you within 24 hours." });
      setForm({ name: "", email: "", service: "", scope: "", budget: "", timeline: "", projectLink: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    submitMutation.mutate(form);
  };

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
        <div className="container px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-background/20 text-primary-foreground border-0 mb-4">Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">Transparent Pricing for Your Project</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-base sm:text-lg">
              At Zap Technologies, we believe in transparency. Our pricing models are designed to meet your business needs while delivering exceptional results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Web Development Packages */}
          <section className="py-16 md:py-20">
            <div className="container px-4">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-3"><Globe className="w-8 h-8 text-primary" /></div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Web Development</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">Choose the package that fits your web development needs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {webPackages.map((pkg, i) => <PricingCard key={pkg.name} pkg={pkg} index={i} />)}
              </div>
            </div>
          </section>

          {/* Mobile App Packages */}
          <section className="py-16 md:py-20 bg-secondary">
            <div className="container px-4">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-3"><Smartphone className="w-8 h-8 text-primary" /></div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Mobile App Development</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">Native and cross-platform mobile solutions</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {mobilePackages.map((pkg, i) => <PricingCard key={pkg.name} pkg={pkg} index={i} />)}
              </div>
            </div>
          </section>

          {/* IT Consulting */}
          <section className="py-16 md:py-20">
            <div className="container px-4">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-3"><Headphones className="w-8 h-8 text-primary" /></div>
                <h2 className="text-3xl font-bold text-foreground mb-2">IT Consulting</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">Expert guidance for your technology decisions</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {consultingPackages.map((pkg, i) => (
                  <motion.div key={pkg.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
                    <p className="text-2xl font-bold text-primary mb-3">{pkg.price}</p>
                    <p className="text-sm text-muted-foreground mb-6">{pkg.desc}</p>
                    {pkg.features.length > 0 && (
                      <ul className="space-y-3 mb-6">
                        {pkg.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button variant="outline" className="rounded-full w-full" asChild><a href="/contact">Inquire Now</a></Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

      {/* Custom Solutions Form */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
              <h2 className="text-3xl font-bold text-foreground mb-2">Custom Solutions for Your Unique Needs</h2>
              <p className="text-muted-foreground">Not all projects fit predefined packages. Tell us about yours and we'll create a tailored quote.</p>
            </div>
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Type of Service</label>
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Select a service</option>
                  <option>Web Development</option>
                  <option>Mobile App Development</option>
                  <option>IT Consulting</option>
                  <option>UI/UX Design</option>
                  <option>Custom Software</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project Scope</label>
                <textarea value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })} placeholder="Describe your project requirements..." rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Budget Range</label>
                  <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Select budget</option>
                    <option>Under $150</option>
                    <option>$150 – $300</option>
                    <option>$300 – $600</option>
                    <option>$600 – $900</option>
                    <option>$900 – $1,500</option>
                    <option>$1,500+</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Timeline</label>
                  <select value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Select timeline</option>
                    <option>3–5 days</option>
                    <option>1–2 weeks</option>
                    <option>2–4 weeks</option>
                    <option>1–2 months</option>
                    <option>2–3 months</option>
                    <option>3+ months</option>
                  </select>
                </div>
              </div>
              {/* Project Link */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Project Link <span className="text-muted-foreground font-normal">(optional)</span></label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.projectLink} onChange={e => setForm({ ...form, projectLink: e.target.value })} placeholder="https://example.com or GitHub link" className="pl-10" />
                </div>
              </div>
              {/* File Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Attach a File <span className="text-muted-foreground font-normal">(max 10 MB)</span></label>
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.txt,.pptx,.xls,.xlsx" />
                  <Button type="button" variant="outline" className="rounded-full" onClick={() => fileInputRef.current?.click()}>
                    <Paperclip className="w-4 h-4 mr-2" /> {file ? 'Change File' : 'Choose File'}
                  </Button>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-foreground/80 bg-muted/50 rounded-full px-3 py-1.5">
                      <span className="truncate max-w-[200px]">{file.name}</span>
                      <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="cta" type="submit" className="rounded-full px-8 w-full sm:w-auto" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} {submitMutation.isPending ? 'Sending...' : 'Request a Quote'}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Payment Terms */}
      <section className="py-16 md:py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">Payment Terms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {paymentTerms.map((t, i) => (
              <motion.div key={t.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <t.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container px-4 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Ready to Discuss Your Project?</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">Get in touch and let's create something extraordinary together.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="cta" size="lg" className="rounded-full px-8" asChild><a href="/contact">Contact Us <ArrowRight className="w-4 h-4 ml-2" /></a></Button>
              <Button size="lg" className="rounded-full px-8 bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90" asChild><a href="/hire">Hire a Developer</a></Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
