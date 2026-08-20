import { motion } from "framer-motion";
import { Shield, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const lastUpdated = "March 1, 2026";

const sections = [
  {
    title: "What Information Do We Collect?",
    content: [
      { heading: "Personal Information", text: "When you fill out forms, sign up for newsletters, or contact us, we may collect details such as your name, email address, phone number, company name, and job title." },
      { heading: "Non-Personal Information", text: "We automatically collect certain information when you visit our website, including browser type, device type, operating system, IP address, referring URLs, and general location data." },
      { heading: "Cookies", text: "We use cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and gather analytics data. See the Cookies section below for more details." },
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      { heading: "To Provide Services", text: "We use your information to respond to inquiries, provide quotes, process requests, and deliver the services you've engaged us for." },
      { heading: "To Improve Our Website", text: "Non-personal data helps us understand how visitors interact with our site, allowing us to optimize functionality and user experience." },
      { heading: "For Communication", text: "We may use your contact information to send newsletters, updates, or promotional materials. You can opt out of marketing communications at any time." },
      { heading: "For Analytics", text: "We use aggregated data for statistical analysis to better understand site usage patterns, trends, and areas for improvement." },
    ],
  },
  {
    title: "How We Protect Your Information",
    content: [
      { heading: "Data Encryption", text: "We use industry-standard SSL/TLS encryption to protect sensitive data transmitted via our website." },
      { heading: "Secure Storage", text: "Personal information is stored securely on protected servers in compliance with industry best practices and applicable regulations." },
      { heading: "Access Control", text: "We limit access to your personal data to authorized personnel only, on a need-to-know basis, and require all staff to adhere to strict confidentiality obligations." },
      { heading: "Compliance", text: "We maintain compliance with applicable data protection regulations including GDPR, CCPA, and follow industry security standards to ensure your data remains protected." },
    ],
  },
  {
    title: "Do We Share Your Information?",
    content: [
      { heading: "Third-Party Service Providers", text: "We may share your information with trusted service providers who assist us in delivering our services, such as email platforms, hosting providers, and payment processors. These providers are contractually obligated to protect your data." },
      { heading: "Legal Compliance", text: "We may disclose your information if required by law, regulation, or in response to a valid legal request such as a subpoena, court order, or government investigation." },
      { heading: "Business Transfers", text: "In the event of a merger, acquisition, or asset sale, your personal information may be transferred as part of the transaction. We will notify you of any such change and any choices you may have regarding your data." },
    ],
  },
  {
    title: "Cookies and Tracking Technologies",
    content: [
      { heading: "How We Use Cookies", text: "We use cookies to personalize content, provide social media features, analyze website traffic, and remember your preferences. Cookies help us deliver a better, more personalized experience." },
      { heading: "Types of Cookies", text: "We use essential cookies (required for site functionality), analytics cookies (to understand usage patterns), and marketing cookies (to deliver relevant advertisements)." },
      { heading: "Opt-Out Options", text: "You can control cookie settings through your browser preferences. Most browsers allow you to block or delete cookies. Please note that disabling cookies may affect the functionality of certain features on our website." },
    ],
  },
  {
    title: "Your Data Protection Rights",
    content: [
      { heading: "Right of Access", text: "You have the right to request a copy of the personal data we hold about you." },
      { heading: "Right to Correction", text: "You can request that we correct any inaccurate or incomplete personal data." },
      { heading: "Right to Deletion", text: "You can request the deletion of your personal data, subject to certain legal exceptions where we may need to retain it." },
      { heading: "Right to Opt-Out", text: "You can opt out of marketing communications at any time by clicking the 'unsubscribe' link in our emails or contacting us directly." },
      { heading: "How to Exercise Your Rights", text: "To exercise any of these rights, please contact us at privacy@zaptechnologies.com. We will respond to your request within 30 days." },
    ],
  },
  {
    title: "Third-Party Links",
    content: [
      { heading: "External Websites", text: "Our website may contain links to third-party websites that are not operated or controlled by Zap Technologies. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policy of every website you visit before submitting any personal data." },
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    content: [
      { heading: "Policy Updates", text: "We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. We will notify you of any significant changes by posting the updated policy on this page and revising the 'Last Updated' date at the top. We encourage you to review this page periodically." },
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-background" style={{ width: 100 + i * 50, height: 100 + i * 50, top: `${15 + i * 18}%`, right: `${5 + i * 10}%` }} animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5 + i, repeat: Infinity }} />
          ))}
        </div>
        <div className="container px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-background/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">Privacy Policy</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-base sm:text-lg">
              At Zap Technologies, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or interact with our services.
            </p>
            <Badge className="bg-background/20 text-primary-foreground border-0 mt-6">Last Updated: {lastUpdated}</Badge>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* table of contents */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-secondary rounded-2xl p-6 sm:p-8 mb-12">
            <h2 className="text-lg font-bold text-foreground mb-4">Table of Contents</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((s, i) => (
                <li key={i}>
                  <a href={`#section-${i}`} className="text-sm text-primary hover:underline flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* sections */}
          {sections.map((section, i) => (
            <motion.div key={i} id={`section-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-4 pl-11">
                {section.content.map((item, j) => (
                  <div key={j}>
                    <h3 className="text-base font-semibold text-foreground mb-1">{item.heading}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-secondary rounded-2xl p-6 sm:p-8 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold text-foreground mb-2">Contact Us</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-4">
              If you have any questions about this Privacy Policy or how we handle your personal data, please don't hesitate to reach out.
            </p>
            <p className="text-sm text-foreground font-medium mb-4">privacy@zaptechnologies.com</p>
            <Button variant="cta" className="rounded-full px-8" asChild>
              <a href="/contact">Get in Touch</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
