import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const lastUpdated = "March 5, 2026";

const sections = [
  {
    title: "1. What Are Cookies?",
    content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used. Cookies can be 'persistent' (remaining on your device until deleted) or 'session' cookies (deleted when you close your browser).",
  },
  {
    title: "2. How We Use Cookies",
    content: "Zap Technologies uses cookies for several purposes including: ensuring our website functions properly, remembering your preferences and settings, understanding how you use our website so we can improve it, and providing relevant content. We use both first-party cookies (set by us) and third-party cookies (set by our partners and service providers).",
  },
  {
    title: "3. Types of Cookies We Use",
    subsections: [
      {
        heading: "Essential Cookies",
        text: "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as setting your privacy preferences, logging in, or filling in forms. Without these cookies, certain parts of the website cannot function properly.",
      },
      {
        heading: "Performance & Analytics Cookies",
        text: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and anonymous.",
      },
      {
        heading: "Functionality Cookies",
        text: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of these services may not function properly.",
      },
      {
        heading: "Targeting & Advertising Cookies",
        text: "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites. They do not store personal information directly but are based on uniquely identifying your browser and internet device.",
      },
    ],
  },
  {
    title: "4. Third-Party Cookies",
    content: "Some cookies are placed by third-party services that appear on our pages. We use services such as Google Analytics to help us understand how visitors use our website. These third parties may use cookies, and their use of cookies is governed by their own privacy and cookie policies, not this Cookie Policy.",
  },
  {
    title: "5. Managing Cookies",
    content: "Most web browsers allow you to control cookies through their settings. You can set your browser to refuse all or some cookies, or to alert you when websites set or access cookies. However, if you block or delete cookies, some parts of our website may not work properly. You can manage your cookie preferences through your browser settings. Here's how to do it in popular browsers: Chrome (Settings → Privacy and Security → Cookies), Firefox (Settings → Privacy & Security → Cookies), Safari (Preferences → Privacy → Cookies), Edge (Settings → Cookies and site permissions).",
  },
  {
    title: "6. Cookie Retention",
    content: "The length of time a cookie will stay on your device depends on its type. Session cookies are temporary and are deleted when you close your browser. Persistent cookies remain on your device for a set period or until you delete them. Analytics cookies typically expire after 2 years, while functionality cookies may last for up to 1 year.",
  },
  {
    title: "7. Updates to This Policy",
    content: "We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make changes, we will update the 'Last updated' date at the top of this policy. We encourage you to review this policy periodically to stay informed about how we use cookies.",
  },
  {
    title: "8. Contact Us",
    content: "If you have any questions about our use of cookies or this Cookie Policy, please contact us at zaptechnologies.online@gmail.com or call us at +92 3014174921. You can also write to us at Multan, Pakistan.",
  },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const CookiePolicy = () => {
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
              <Cookie className="h-3.5 w-3.5 mr-1.5" /> Legal
            </Badge>
          </motion.div>
          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground leading-tight mb-4">
            Cookie Policy
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
            This Cookie Policy explains what cookies are, how Zap Technologies uses them, and how you can manage your cookie preferences when visiting our website.
          </motion.p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.div key={section.title} {...fadeUp} transition={{ delay: i * 0.03 }}>
                <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
                {section.content && (
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                )}
                {section.subsections && (
                  <div className="space-y-4 mt-4">
                    {section.subsections.map((sub) => (
                      <div key={sub.heading} className="pl-4 border-l-2 border-primary/20">
                        <h3 className="font-semibold text-foreground mb-1">{sub.heading}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{sub.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
