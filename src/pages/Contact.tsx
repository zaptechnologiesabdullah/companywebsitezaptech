import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Mail, Phone, MapPin, Clock, Send,
  Linkedin, Twitter, Facebook, Instagram,
  Rocket, Paperclip, Link2, X, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

/* ─── Data ─── */
const contactInfo = [
  { icon: Mail, label: "Email", value: "zaptechnologies.online@gmail.com", href: "mailto:zaptechnologies.online@gmail.com" },
  { icon: Phone, label: "Phone", value: "+92 3014174921", href: "tel:+923014174921" },
  { icon: MapPin, label: "Address", value: "Multan, Pakistan", href: null },
  { icon: Clock, label: "Hours", value: "Mon – Fri: 9 AM – 6 PM PKT", href: null },
];

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

const faqs = [
  { q: "How do I start a project with Zap Technologies?", a: "Simply fill out the contact form above or send us an email. We'll get back to you within 24 hours to discuss your project requirements, timeline, and budget." },
  { q: "What are your pricing models?", a: "We offer flexible pricing: hourly rates for ongoing work, fixed-price contracts for well-defined projects, and dedicated full-time developer hiring. Let us know what fits your needs!" },
  { q: "Do you offer ongoing support after launch?", a: "Yes! We provide post-launch support and maintenance packages for all our projects, including bug fixes, feature updates, performance monitoring, and security patches." },
  { q: "What technologies do you work with?", a: "Our team is proficient in React, Node.js, Python, Swift, Flutter, AWS, Azure, and many more. We choose the best technology stack based on your project requirements." },
  { q: "How long does a typical project take?", a: "Timelines vary based on scope and complexity. A simple website may take 2–4 weeks, while a full-scale application could take 3–6 months. We'll provide a detailed estimate after discussing your needs." },
];

const inquiryTypes = ["General Inquiry", "Service Request", "Support Request", "Partnership Inquiry", "Other"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png", "image/jpeg", "image/webp",
  "application/zip", "text/plain",
];

const Contact = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", inquiryType: "", budget: "", timeline: "", message: "", projectLink: "",
    // Service Request fields
    serviceType: "", projectScope: "",
    // Support Request fields
    issueType: "", urgency: "", existingProjectUrl: "",
    // Partnership fields
    companyName: "", partnershipType: "", website: "",
    // Other
    subject: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Allowed: PDF, DOC, DOCX, PNG, JPG, WEBP, ZIP, TXT.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const buildMessage = () => {
    const parts = [formData.message];
    if (formData.phone) parts.push(`Phone: ${formData.phone}`);

    switch (formData.inquiryType) {
      case "Service Request":
        if (formData.serviceType) parts.push(`Service Needed: ${formData.serviceType}`);
        if (formData.budget) parts.push(`Budget: ${formData.budget}`);
        if (formData.timeline) parts.push(`Timeline: ${formData.timeline}`);
        if (formData.projectScope) parts.push(`Project Scope: ${formData.projectScope}`);
        if (formData.projectLink) parts.push(`Project Link: ${formData.projectLink}`);
        break;
      case "Support Request":
        if (formData.issueType) parts.push(`Issue Type: ${formData.issueType}`);
        if (formData.urgency) parts.push(`Urgency: ${formData.urgency}`);
        if (formData.existingProjectUrl) parts.push(`Project URL: ${formData.existingProjectUrl}`);
        break;
      case "Partnership Inquiry":
        if (formData.companyName) parts.push(`Company: ${formData.companyName}`);
        if (formData.partnershipType) parts.push(`Partnership Type: ${formData.partnershipType}`);
        if (formData.website) parts.push(`Website: ${formData.website}`);
        break;
      case "Other":
        if (formData.subject) parts.push(`Subject: ${formData.subject}`);
        break;
      default:
        if (formData.budget) parts.push(`Budget: ${formData.budget}`);
        if (formData.timeline) parts.push(`Timeline: ${formData.timeline}`);
        if (formData.projectLink) parts.push(`Project Link: ${formData.projectLink}`);
        break;
    }
    return parts.filter(Boolean).join("\n");
  };

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      let attachmentUrl: string | null = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("form-attachments")
          .upload(fileName, selectedFile);
        if (uploadError) throw new Error("File upload failed: " + uploadError.message);

        const { data: urlData } = supabase.storage
          .from("form-attachments")
          .getPublicUrl(fileName);
        attachmentUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("form_queries").insert({
        name: data.name,
        email: data.email,
        subject: data.inquiryType || null,
        message: buildMessage(),
        project_link: data.projectLink || data.existingProjectUrl || data.website || null,
        attachment_url: attachmentUrl,
      });
      if (error) throw error;

      supabase.functions.invoke("send-contact-email", {
        body: { ...data, attachmentUrl },
      }).catch((err) => console.error("Email notification failed:", err));
    },
    onSuccess: () => {
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", inquiryType: "", budget: "", timeline: "", message: "", projectLink: "", serviceType: "", projectScope: "", issueType: "", urgency: "", existingProjectUrl: "", companyName: "", partnershipType: "", website: "", subject: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (e: Error) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill in name, email, and message.", variant: "destructive" });
      return;
    }
    submitMutation.mutate(formData);
  };

  const messagePlaceholders: Record<string, string> = {
    "Service Request": "Describe the service you need, features, target audience, etc.",
    "Support Request": "Describe the issue you're facing in detail...",
    "Partnership Inquiry": "Tell us about your company and how you'd like to collaborate...",
    "General Inquiry": "Tell us about your project or inquiry...",
    "Other": "What would you like to discuss?",
  };

  const renderDynamicFields = () => {
    switch (formData.inquiryType) {
      case "Service Request":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Service Needed *</Label>
                <Select value={formData.serviceType} onValueChange={(v) => handleChange("serviceType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Cloud & DevOps">Cloud & DevOps</SelectItem>
                    <SelectItem value="AI / SaaS">AI / SaaS Solutions</SelectItem>
                    <SelectItem value="Custom Software">Custom Software</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project Scope</Label>
                <Select value={formData.projectScope} onValueChange={(v) => handleChange("projectScope", v)}>
                  <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Small (Landing page / MVP)">Small (Landing page / MVP)</SelectItem>
                    <SelectItem value="Medium (Full website / App)">Medium (Full website / App)</SelectItem>
                    <SelectItem value="Large (Enterprise solution)">Large (Enterprise solution)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Budget Range (optional)</Label>
                <Select value={formData.budget} onValueChange={(v) => handleChange("budget", v)}>
                  <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< $5k">Less than $5,000</SelectItem>
                    <SelectItem value="$5k-$15k">$5,000 – $15,000</SelectItem>
                    <SelectItem value="$15k-$50k">$15,000 – $50,000</SelectItem>
                    <SelectItem value="$50k+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Select value={formData.timeline} onValueChange={(v) => handleChange("timeline", v)}>
                  <SelectTrigger><SelectValue placeholder="When to start?" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP">As soon as possible</SelectItem>
                    <SelectItem value="1-2 months">1 – 2 months</SelectItem>
                    <SelectItem value="3-6 months">3 – 6 months</SelectItem>
                    <SelectItem value="Not sure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectLink" className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Project Link / Reference URL (optional)
              </Label>
              <Input id="projectLink" type="url" placeholder="https://your-project.com or https://figma.com/..." value={formData.projectLink} onChange={(e) => handleChange("projectLink", e.target.value)} maxLength={500} />
            </div>
            {renderFileUpload()}
          </>
        );

      case "Support Request":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Issue Type *</Label>
                <Select value={formData.issueType} onValueChange={(v) => handleChange("issueType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select issue type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bug / Error">Bug / Error</SelectItem>
                    <SelectItem value="Performance Issue">Performance Issue</SelectItem>
                    <SelectItem value="Feature Not Working">Feature Not Working</SelectItem>
                    <SelectItem value="Account / Access Issue">Account / Access Issue</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Urgency</Label>
                <Select value={formData.urgency} onValueChange={(v) => handleChange("urgency", v)}>
                  <SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low – No rush</SelectItem>
                    <SelectItem value="Medium">Medium – Within a few days</SelectItem>
                    <SelectItem value="High">High – Urgent, blocking work</SelectItem>
                    <SelectItem value="Critical">Critical – System down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingProjectUrl" className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Affected Project / URL
              </Label>
              <Input id="existingProjectUrl" type="url" placeholder="https://your-app.com/affected-page" value={formData.existingProjectUrl} onChange={(e) => handleChange("existingProjectUrl", e.target.value)} maxLength={500} />
            </div>
            {renderFileUpload()}
          </>
        );

      case "Partnership Inquiry":
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input id="companyName" placeholder="Your company name" value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>Partnership Type</Label>
                <Select value={formData.partnershipType} onValueChange={(v) => handleChange("partnershipType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology Partner">Technology Partner</SelectItem>
                    <SelectItem value="Reseller / Referral">Reseller / Referral</SelectItem>
                    <SelectItem value="White Label">White Label</SelectItem>
                    <SelectItem value="Joint Venture">Joint Venture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Company Website
              </Label>
              <Input id="website" type="url" placeholder="https://yourcompany.com" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} maxLength={500} />
            </div>
          </>
        );

      case "Other":
        return (
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" placeholder="What is this about?" value={formData.subject} onChange={(e) => handleChange("subject", e.target.value)} maxLength={200} />
          </div>
        );

      case "General Inquiry":
      default:
        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Budget Range (optional)</Label>
                <Select value={formData.budget} onValueChange={(v) => handleChange("budget", v)}>
                  <SelectTrigger><SelectValue placeholder="Select budget" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="< $5k">Less than $5,000</SelectItem>
                    <SelectItem value="$5k-$15k">$5,000 – $15,000</SelectItem>
                    <SelectItem value="$15k-$50k">$15,000 – $50,000</SelectItem>
                    <SelectItem value="$50k+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timeline (optional)</Label>
                <Select value={formData.timeline} onValueChange={(v) => handleChange("timeline", v)}>
                  <SelectTrigger><SelectValue placeholder="When to start?" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP">As soon as possible</SelectItem>
                    <SelectItem value="1-2 months">1 – 2 months</SelectItem>
                    <SelectItem value="3-6 months">3 – 6 months</SelectItem>
                    <SelectItem value="Not sure">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectLink" className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Project Link / Reference URL (optional)
              </Label>
              <Input id="projectLink" type="url" placeholder="https://your-project.com or https://figma.com/..." value={formData.projectLink} onChange={(e) => handleChange("projectLink", e.target.value)} maxLength={500} />
            </div>
            {renderFileUpload()}
          </>
        );
    }
  };

  const renderFileUpload = () => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-primary" />
        Attach a File (optional)
      </Label>
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.zip,.txt"
          className="hidden"
          id="file-upload"
        />
        {!selectedFile ? (
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Paperclip className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Click to upload a file</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, PNG, JPG, ZIP, TXT — Max 10MB</p>
            </div>
          </label>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-nav pt-28 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_90%_25%)_0%,_hsl(220_40%_10%)_60%,_hsl(220_30%_6%)_100%)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,_hsl(217_90%_60%)_0%,_transparent_50%)]" />
        <div className="relative z-10 container px-4 text-center max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="text-primary-foreground">Get in Touch </span>
            <span className="text-accent">with Us</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="mt-5 text-base sm:text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Have a project in mind? Want to discuss how we can help your business grow with technology? Reach out to us today, and let's start the conversation!
          </motion.p>
        </div>
      </section>

      {/* ── Contact Form + Info ── */}
      <section className="py-16 sm:py-24">
        <div className="container px-4">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
            We'd Love to <span className="text-primary">Hear From You</span>
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
            {/* Form */}
            <motion.form onSubmit={handleSubmit} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
              {/* Always visible: Name, Email, Phone, Inquiry Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" placeholder="Your full name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required maxLength={255} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} maxLength={20} />
                </div>
                <div className="space-y-2">
                  <Label>Inquiry Type</Label>
                  <Select value={formData.inquiryType} onValueChange={(v) => handleChange("inquiryType", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic fields based on inquiry type */}
              {renderDynamicFields()}

              {/* Message - always visible */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" placeholder={messagePlaceholders[formData.inquiryType] || messagePlaceholders["General Inquiry"]} rows={5} value={formData.message} onChange={(e) => handleChange("message", e.target.value)} required maxLength={2000} />
              </div>

              <Button type="submit" variant="cta" size="lg" className="w-full sm:w-auto rounded-full px-10 text-base gap-2" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} {submitMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>

            {/* Sidebar */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold">Other Ways to Reach Us</h3>
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <c.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{c.value}</a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} aria-label={s.label} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Google Map ── */}
      <section className="py-16 sm:py-20 bg-muted/40">
        <div className="container px-4 max-w-6xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10">
            Find Us <span className="text-primary">Here</span>
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <iframe title="Zap Technologies Office Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110067.67794830027!2d71.39032695!3d30.19679235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393b316722cee601%3A0x3424f3e0b59eed13!2sMultan%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full" />
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-24">
        <div className="container px-4 max-w-3xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Have Questions? <span className="text-primary">Check Our FAQ</span>
          </motion.h2>
          <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">Find quick answers to the most common questions about working with us.</p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-5 data-[state=open]:shadow-sm transition-shadow">
                  <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline gap-3">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(217_90%_25%)_0%,_hsl(220_40%_10%)_60%,_hsl(220_30%_6%)_100%)]" />
        <div className="relative z-10 container px-4 text-center max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <Rocket className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Project?</h2>
            <p className="text-primary-foreground/70 text-base sm:text-lg max-w-xl mx-auto mb-8">Let's turn your ideas into reality. Get in touch with us, and let's build something amazing together!</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="cta" size="lg" className="rounded-full px-10 text-base" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Send Us a Message</Button>
              <Button variant="outline" size="lg" className="rounded-full px-10 text-base bg-primary-foreground text-foreground border-none hover:bg-primary-foreground/90 font-semibold" asChild>
                <a href="/hire">Request a Quote</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
