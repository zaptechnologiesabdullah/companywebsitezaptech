import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const lastUpdated = "March 5, 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using the Zap Technologies website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must not use our website or services. These terms apply to all visitors, users, and clients of Zap Technologies.",
  },
  {
    title: "2. Services",
    content: "Zap Technologies provides software development, web development, mobile app development, UI/UX design, and related technology consulting services. The scope, timeline, and deliverables for each project will be defined in a separate service agreement or statement of work (SOW) agreed upon by both parties before the commencement of work.",
  },
  {
    title: "3. Intellectual Property",
    content: "All content on this website, including but not limited to text, graphics, logos, images, software, and code, is the property of Zap Technologies and is protected by international copyright and intellectual property laws. Upon full payment for services rendered, clients receive ownership of the final deliverables as specified in the service agreement. Zap Technologies retains the right to showcase completed work in its portfolio unless otherwise agreed in writing.",
  },
  {
    title: "4. Client Responsibilities",
    content: "Clients are responsible for providing accurate and complete information required for project execution, timely feedback and approvals during the development process, ensuring they have the legal rights to any content, images, or materials provided to us, and maintaining the confidentiality of any login credentials or access details shared with them.",
  },
  {
    title: "5. Payment Terms",
    content: "Payment terms are outlined in individual project agreements. Generally, projects require an upfront deposit before work begins, with remaining payments due at agreed milestones or upon completion. Late payments may incur additional charges. Zap Technologies reserves the right to pause or suspend work on any project with outstanding payments beyond the agreed payment terms.",
  },
  {
    title: "6. Project Timelines",
    content: "While we strive to meet all agreed-upon deadlines, project timelines may be affected by factors outside our control, including delays in client feedback, changes in project scope, or third-party dependencies. Any changes to the project scope may result in adjusted timelines and costs, which will be communicated and agreed upon before proceeding.",
  },
  {
    title: "7. Limitation of Liability",
    content: "Zap Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use of our services or website. Our total liability for any claim related to our services shall not exceed the amount paid by the client for the specific service in question. We do not guarantee that our website will be uninterrupted, error-free, or free from viruses or other harmful components.",
  },
  {
    title: "8. Confidentiality",
    content: "Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of a project. This includes business strategies, technical specifications, user data, and any other information designated as confidential. This obligation survives the termination of any service agreement.",
  },
  {
    title: "9. Termination",
    content: "Either party may terminate a service agreement with written notice as specified in the individual project contract. Upon termination, the client is responsible for payment of all work completed up to the date of termination. Any materials or deliverables completed and paid for will be transferred to the client.",
  },
  {
    title: "10. Third-Party Services",
    content: "Our website may contain links to third-party websites or services that are not owned or controlled by Zap Technologies. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. Use of third-party services is at your own risk.",
  },
  {
    title: "11. Dispute Resolution",
    content: "Any disputes arising from these terms or our services shall first be attempted to be resolved through good-faith negotiation. If a resolution cannot be reached, disputes shall be submitted to binding arbitration in accordance with the laws of Pakistan. The prevailing party shall be entitled to recover reasonable attorney fees and costs.",
  },
  {
    title: "12. Changes to Terms",
    content: "Zap Technologies reserves the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our website or services after any changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.",
  },
  {
    title: "13. Contact Us",
    content: "If you have any questions about these Terms & Conditions, please contact us at zaptechnologies.online@gmail.com or call us at +92 3014174921.",
  },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(230,70%,30%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="container px-4 relative z-10 text-center max-w-3xl mx-auto">
          <motion.div {...fadeUp}>
            <Badge variant="secondary" className="mb-4 bg-primary-foreground/10 text-primary-foreground border-0 px-4 py-1.5">
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Legal
            </Badge>
          </motion.div>
          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
            Terms & Conditions
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-primary-foreground/70 text-lg">
            Last updated: {lastUpdated}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container px-4 max-w-4xl mx-auto">
          <motion.p {...fadeUp} className="text-muted-foreground leading-relaxed mb-12 text-lg">
            Please read these Terms & Conditions carefully before using the Zap Technologies website or engaging our services. These terms govern your relationship with Zap Technologies and your use of our platform.
          </motion.p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.03 }}>
                <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsConditions;
