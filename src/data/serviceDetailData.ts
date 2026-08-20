import {
  Globe, Smartphone, Palette, Wrench, PenTool, Megaphone, Search, BrainCircuit, Bot,
  type LucideIcon,
} from "lucide-react";

export interface CaseStudy {
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  image: string;
}

export interface ServicePageData {
  slug: string;
  icon: LucideIcon;
  title: string;
  seoTitle: string;
  heroIntro: string;
  heroImage: string;
  whatWeOffer: string;
  benefits: { title: string; desc: string }[];
  technologies: { category: string; items: string[] }[];
  caseStudies: CaseStudy[];
  faqs: { q: string; a: string }[];
}

export const servicePages: ServicePageData[] = [
  {
    slug: "web-development",
    icon: Globe,
    title: "Web Development",
    seoTitle: "Custom Web Development Services",
    heroIntro:
      "At Zap Technologies, we create custom, high-performance websites that drive business growth. Our web development services focus on delivering a seamless user experience and cutting-edge technology to meet your business goals.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    whatWeOffer:
      "Our web development service includes designing and building custom websites that cater to your unique business needs. Whether you're looking for an informational website, e-commerce platform, or a complex web application, our team of experienced developers will work with you to deliver a solution that meets your business goals and provides an exceptional user experience. We leverage modern frameworks and cloud infrastructure to ensure your site is fast, secure, and scalable.",
    benefits: [
      { title: "Custom Solutions", desc: "We create websites tailored to your business needs, ensuring you stand out from your competition." },
      { title: "Responsive Design", desc: "All our websites are mobile-friendly and responsive, providing a great user experience across all devices." },
      { title: "SEO-Friendly", desc: "Our web development process includes on-page SEO optimization to ensure your website is ready to rank in search engines." },
      { title: "Scalability", desc: "Our websites are built to grow with your business, allowing you to scale as your needs evolve." },
      { title: "Performance Optimized", desc: "We ensure lightning-fast load times through code optimization, caching, and CDN integration." },
      { title: "Security First", desc: "SSL certificates, secure authentication, and regular security audits to protect your data and users." },
    ],
    technologies: [
      { category: "Frontend", items: ["React.js", "Next.js", "Angular", "Vue.js", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Python", "PHP", "Ruby on Rails", "Django", ".NET"] },
      { category: "Database", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase"] },
      { category: "CMS & Tools", items: ["WordPress", "Shopify", "Strapi", "Git", "Docker", "AWS"] },
    ],
    caseStudies: [
      {
        title: "XYZ E-Commerce Platform",
        client: "XYZ Retail",
        challenge: "XYZ Retail needed an e-commerce platform that could handle high traffic during peak sales seasons without performance degradation.",
        solution: "We built a scalable, high-performance website with cloud hosting, multi-payment gateway integration, and an advanced caching system.",
        results: ["40% increase in conversions", "20% reduction in cart abandonment", "99.9% uptime during Black Friday"],
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
      },
      {
        title: "HealthFirst Patient Portal",
        client: "HealthFirst Medical",
        challenge: "A healthcare provider needed a secure, HIPAA-compliant patient portal for appointment scheduling and medical records access.",
        solution: "We developed a responsive web application with end-to-end encryption, role-based access control, and integration with their existing EHR system.",
        results: ["60% reduction in phone appointments", "95% patient satisfaction score", "Full HIPAA compliance achieved"],
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
      },
    ],
    faqs: [
      { q: "How long does a typical web development project take?", a: "Timelines vary based on complexity. A basic website takes 2-4 weeks, while complex web applications can take 3-6 months. We provide detailed timelines during our discovery phase." },
      { q: "What's included in the pricing?", a: "Our pricing covers design, development, testing, and deployment. Ongoing maintenance and hosting are available as separate packages." },
      { q: "Can you redesign my existing website?", a: "Absolutely! We can redesign and rebuild your existing website while preserving your SEO rankings and migrating your content seamlessly." },
      { q: "Do you provide hosting and maintenance?", a: "Yes, we offer hosting setup, ongoing maintenance packages, security monitoring, and performance optimization services." },
    ],
  },
  {
    slug: "mobile-app-development",
    icon: Smartphone,
    title: "Mobile App Development",
    seoTitle: "Custom Mobile App Development Services",
    heroIntro:
      "We specialize in creating mobile apps for iOS and Android platforms. Whether you need a native app or cross-platform solution, we provide end-to-end development from ideation to deployment.",
    heroImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    whatWeOffer:
      "We deliver intuitive, high-performance mobile applications that engage users and drive business results. Our mobile development team works closely with you from concept to launch, ensuring every feature is purposefully designed and flawlessly executed. We build native apps for iOS and Android, as well as cross-platform solutions using React Native and Flutter, giving you maximum reach with optimal performance.",
    benefits: [
      { title: "Native & Cross-Platform", desc: "We develop both native and cross-platform apps for a wide range of devices and operating systems." },
      { title: "User-Centered Design", desc: "Our mobile apps are designed with the user in mind, ensuring a seamless and intuitive experience." },
      { title: "End-to-End Service", desc: "From concept and design to development, testing, and launch, we provide complete app development services." },
      { title: "Offline Capability", desc: "We build apps that work seamlessly even without internet connectivity, syncing data when back online." },
      { title: "Push Notifications", desc: "Engage users with targeted push notifications that drive retention and re-engagement." },
      { title: "App Store Optimization", desc: "We optimize your app listing for maximum visibility and downloads on both App Store and Google Play." },
    ],
    technologies: [
      { category: "iOS", items: ["Swift", "SwiftUI", "Xcode", "Core Data", "ARKit"] },
      { category: "Android", items: ["Kotlin", "Jetpack Compose", "Android Studio", "Room", "Firebase"] },
      { category: "Cross-Platform", items: ["React Native", "Flutter", "Expo", "Capacitor"] },
      { category: "Backend & APIs", items: ["Node.js", "GraphQL", "REST APIs", "AWS", "Firebase"] },
    ],
    caseStudies: [
      {
        title: "FitTrack Fitness App",
        client: "FitTrack Inc.",
        challenge: "FitTrack needed a fitness tracking app with real-time workout monitoring, social features, and integration with wearable devices.",
        solution: "We built a cross-platform app using React Native with HealthKit/Google Fit integration, real-time data sync, and a social feed.",
        results: ["100K+ downloads in first month", "4.8-star App Store rating", "35% daily active user rate"],
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
      },
    ],
    faqs: [
      { q: "Should I build a native or cross-platform app?", a: "It depends on your needs. Native apps offer the best performance, while cross-platform solutions like React Native provide cost efficiency with near-native performance. We'll help you decide." },
      { q: "How long does mobile app development take?", a: "A basic app takes 2-3 months, while complex apps with advanced features can take 4-8 months. We use agile methodology for continuous delivery." },
      { q: "Do you handle app store submission?", a: "Yes, we manage the entire submission process for both Apple App Store and Google Play Store, including compliance with their guidelines." },
      { q: "Can you add features to my existing app?", a: "Yes, we can enhance existing applications with new features, improved UI/UX, and performance optimizations." },
    ],
  },
  {
    slug: "ui-ux-design",
    icon: Palette,
    title: "UI/UX Design",
    seoTitle: "Professional UI/UX Design Services",
    heroIntro:
      "We design intuitive, visually stunning interfaces that delight users and drive conversions. Our human-centered design approach ensures every interaction feels natural and purposeful.",
    heroImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    whatWeOffer:
      "Our UI/UX design services cover the full spectrum of user experience, from initial research and wireframing to high-fidelity prototypes and usability testing. We create designs that not only look beautiful but also solve real user problems and achieve your business objectives. Every pixel is purposeful, every interaction is intentional.",
    benefits: [
      { title: "User Research Driven", desc: "We base our designs on real user data, ensuring solutions that genuinely address user needs and pain points." },
      { title: "Conversion Optimized", desc: "Our designs are crafted to guide users toward key actions, improving conversion rates and business outcomes." },
      { title: "Brand Consistency", desc: "We create comprehensive design systems that maintain brand consistency across all touchpoints." },
      { title: "Accessibility First", desc: "We design for inclusivity, ensuring your product is usable by everyone regardless of ability." },
      { title: "Rapid Prototyping", desc: "Interactive prototypes allow you to test and validate concepts before investing in development." },
      { title: "Design Systems", desc: "Scalable design systems that ensure consistency and speed up future development." },
    ],
    technologies: [
      { category: "Design Tools", items: ["Figma", "Adobe XD", "Sketch", "InVision", "Framer"] },
      { category: "Prototyping", items: ["Figma Prototyping", "Principle", "ProtoPie", "Marvel"] },
      { category: "Research", items: ["Hotjar", "UserTesting", "Maze", "Google Analytics", "A/B Testing"] },
      { category: "Handoff", items: ["Zeplin", "Figma Dev Mode", "Storybook", "Design Tokens"] },
    ],
    caseStudies: [
      {
        title: "FinanceHub Dashboard Redesign",
        client: "FinanceHub Corp",
        challenge: "FinanceHub's existing dashboard was cluttered and confusing, leading to high user drop-off and poor adoption rates.",
        solution: "We conducted extensive user research, redesigned the information architecture, and created an intuitive dashboard with data visualization.",
        results: ["45% increase in user engagement", "30% faster task completion", "NPS score improved from 32 to 71"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
      },
    ],
    faqs: [
      { q: "What's the difference between UI and UX design?", a: "UX (User Experience) focuses on the overall feel and usability of a product, while UI (User Interface) focuses on the visual design and interactive elements. We provide both as an integrated service." },
      { q: "Do you conduct user testing?", a: "Yes, usability testing is a core part of our design process. We test with real users to validate our designs and iterate based on feedback." },
      { q: "Can you create a design system for our brand?", a: "Absolutely! We create comprehensive design systems including components, patterns, guidelines, and tokens that ensure consistency across your products." },
    ],
  },
  {
    slug: "website-maintenance",
    icon: Wrench,
    title: "Website Maintenance & Services",
    seoTitle: "Website Maintenance & Support Services",
    heroIntro:
      "Keep your website running at peak performance with our comprehensive maintenance services. We handle updates, security, backups, and optimization so you can focus on your business.",
    heroImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    whatWeOffer:
      "Our website maintenance services ensure your site remains secure, fast, and up-to-date. We provide proactive monitoring, regular updates, security patches, and performance optimization to prevent issues before they impact your users. Think of us as your dedicated website care team.",
    benefits: [
      { title: "24/7 Monitoring", desc: "Round-the-clock uptime monitoring with instant alerts for any issues that arise." },
      { title: "Security Updates", desc: "Regular security patches and vulnerability assessments to protect against threats." },
      { title: "Performance Optimization", desc: "Continuous optimization to ensure fast loading times and smooth user experiences." },
      { title: "Regular Backups", desc: "Automated backups with quick restore capabilities for disaster recovery." },
      { title: "Content Updates", desc: "We handle content updates, new pages, and feature additions as needed." },
      { title: "Monthly Reporting", desc: "Detailed reports on uptime, performance, security, and recommendations." },
    ],
    technologies: [
      { category: "Monitoring", items: ["Pingdom", "New Relic", "Datadog", "UptimeRobot"] },
      { category: "Security", items: ["SSL/TLS", "WAF", "Malware Scanning", "DDoS Protection"] },
      { category: "Performance", items: ["Cloudflare CDN", "Redis Cache", "Image Optimization", "Lazy Loading"] },
      { category: "Backup", items: ["AWS S3", "Automated Snapshots", "Version Control", "Disaster Recovery"] },
    ],
    caseStudies: [
      {
        title: "E-Commerce Uptime Guarantee",
        client: "ShopMax Online",
        challenge: "ShopMax was experiencing frequent downtime and slow load times during peak shopping hours, resulting in lost revenue.",
        solution: "We implemented CDN caching, database optimization, load balancing, and 24/7 monitoring with automated failover.",
        results: ["99.99% uptime achieved", "60% faster page load times", "$200K revenue saved from prevented downtime"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
      },
    ],
    faqs: [
      { q: "What does your maintenance plan include?", a: "Our plans include uptime monitoring, security updates, regular backups, performance optimization, content updates, and monthly reporting." },
      { q: "How quickly do you respond to issues?", a: "We offer response times as fast as 1 hour for critical issues and 4 hours for non-critical requests, depending on your plan." },
      { q: "Can you maintain a site built by another agency?", a: "Yes, we can take over maintenance for any website regardless of who originally built it. We'll start with a thorough audit." },
    ],
  },
  {
    slug: "graphic-design",
    icon: PenTool,
    title: "Graphic Design",
    seoTitle: "Professional Graphic Design Services",
    heroIntro:
      "From brand identity to marketing collateral, we create stunning visual designs that communicate your brand story and make a lasting impression on your audience.",
    heroImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    whatWeOffer:
      "Our graphic design team creates compelling visual content that strengthens your brand and captivates your audience. Whether you need a complete brand identity, marketing materials, social media graphics, or packaging design, we deliver creative solutions that align with your business goals and resonate with your target market.",
    benefits: [
      { title: "Brand Identity", desc: "Complete brand identity packages including logos, color palettes, typography, and brand guidelines." },
      { title: "Print & Digital", desc: "We design for both print and digital media, ensuring consistency across all channels." },
      { title: "Fast Turnaround", desc: "Efficient design process with quick iterations and timely delivery of final assets." },
      { title: "Multiple Concepts", desc: "We present multiple creative directions so you can choose the one that best fits your vision." },
      { title: "Production-Ready Files", desc: "All deliverables come in production-ready formats suitable for print, web, and social media." },
      { title: "Brand Consistency", desc: "We create comprehensive brand guidelines to ensure visual consistency across all touchpoints." },
    ],
    technologies: [
      { category: "Design Software", items: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Figma"] },
      { category: "Motion & Video", items: ["After Effects", "Premiere Pro", "Lottie", "Cinema 4D"] },
      { category: "3D & Rendering", items: ["Blender", "SketchUp", "KeyShot", "Dimension"] },
      { category: "Collaboration", items: ["Figma", "Miro", "Notion", "Slack"] },
    ],
    caseStudies: [
      {
        title: "TechVenture Brand Identity",
        client: "TechVenture Startups",
        challenge: "A new tech accelerator needed a complete brand identity that conveyed innovation, trust, and entrepreneurial spirit.",
        solution: "We designed a modern logo, color system, typography suite, and comprehensive brand guidelines with templates for all marketing materials.",
        results: ["Brand recognition increased by 200%", "Consistent identity across 15+ touchpoints", "Featured in Design Awards"],
        image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
      },
    ],
    faqs: [
      { q: "How many design concepts do you provide?", a: "We typically provide 2-3 initial concepts for logo and branding projects. You choose the direction, and we refine it through multiple rounds of revisions." },
      { q: "What file formats do I receive?", a: "You receive all source files plus exports in PNG, JPG, SVG, PDF, and any other formats you need for print and digital use." },
      { q: "Can you match my existing brand style?", a: "Absolutely! We can work within existing brand guidelines to create new materials that are perfectly aligned with your established identity." },
    ],
  },
  {
    slug: "digital-marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    seoTitle: "Data-Driven Digital Marketing Services",
    heroIntro:
      "Drive measurable growth with data-driven digital marketing strategies. We help you reach the right audience, at the right time, with the right message across all digital channels.",
    heroImage: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&q=80",
    whatWeOffer:
      "Our digital marketing services encompass everything from social media management and PPC advertising to email campaigns and content marketing. We use data-driven strategies to maximize your ROI and build meaningful connections with your target audience. Every campaign is tailored to your business goals and continuously optimized for peak performance.",
    benefits: [
      { title: "Data-Driven Strategy", desc: "Every campaign is backed by data and analytics, ensuring maximum return on your marketing investment." },
      { title: "Multi-Channel Approach", desc: "We create cohesive campaigns across social media, search, email, and content marketing channels." },
      { title: "Targeted Advertising", desc: "Advanced audience targeting ensures your ads reach the people most likely to convert." },
      { title: "Content That Converts", desc: "Engaging content strategies that attract, educate, and convert your target audience." },
      { title: "Continuous Optimization", desc: "A/B testing and ongoing optimization to improve campaign performance over time." },
      { title: "Transparent Reporting", desc: "Clear, detailed reports showing exactly how your marketing budget is performing." },
    ],
    technologies: [
      { category: "Advertising", items: ["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads"] },
      { category: "Social Media", items: ["Hootsuite", "Buffer", "Sprout Social", "Later"] },
      { category: "Email", items: ["Mailchimp", "SendGrid", "HubSpot", "ConvertKit"] },
      { category: "Analytics", items: ["Google Analytics", "Google Tag Manager", "Hotjar", "Mixpanel"] },
    ],
    caseStudies: [
      {
        title: "SaaS Growth Campaign",
        client: "CloudSync Solutions",
        challenge: "A B2B SaaS company needed to increase qualified leads and reduce customer acquisition costs.",
        solution: "We implemented a multi-channel strategy combining LinkedIn Ads, content marketing, email nurture sequences, and retargeting campaigns.",
        results: ["300% increase in qualified leads", "45% reduction in CAC", "2.5x improvement in email open rates"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      },
    ],
    faqs: [
      { q: "How long before I see results?", a: "PPC campaigns can show results within days, while organic strategies like SEO and content marketing typically take 3-6 months for significant impact." },
      { q: "What's the minimum marketing budget?", a: "We recommend a minimum ad spend of $1,000/month for PPC campaigns. Our management fees are separate and based on the scope of services." },
      { q: "Do you provide monthly reports?", a: "Yes, we provide detailed monthly reports with key metrics, insights, and recommendations for optimization." },
    ],
  },
  {
    slug: "seo",
    icon: Search,
    title: "Search Engine Optimisation",
    seoTitle: "Professional SEO Services",
    heroIntro:
      "Boost your organic visibility and drive qualified traffic with our comprehensive SEO services. We use proven strategies to improve your rankings and grow your online presence.",
    heroImage: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
    whatWeOffer:
      "Our SEO services cover everything from technical audits and on-page optimization to content strategy and link building. We take a holistic approach to search engine optimization, ensuring your website not only ranks higher but also converts visitors into customers. Our strategies are white-hat, sustainable, and aligned with the latest search engine algorithms.",
    benefits: [
      { title: "Technical SEO", desc: "We fix technical issues that prevent search engines from properly crawling and indexing your site." },
      { title: "Keyword Strategy", desc: "Data-driven keyword research to target terms that drive qualified traffic and conversions." },
      { title: "Content Optimization", desc: "We optimize existing content and create new content that ranks and engages your audience." },
      { title: "Local SEO", desc: "Dominate local search results with optimized Google Business Profile and local citation building." },
      { title: "Link Building", desc: "Ethical, white-hat link building strategies to increase your domain authority and rankings." },
      { title: "Performance Tracking", desc: "Comprehensive tracking of rankings, traffic, and conversions with actionable insights." },
    ],
    technologies: [
      { category: "Research", items: ["Ahrefs", "SEMrush", "Moz", "Google Keyword Planner"] },
      { category: "Technical", items: ["Screaming Frog", "Google Search Console", "PageSpeed Insights", "Schema.org"] },
      { category: "Analytics", items: ["Google Analytics 4", "Google Tag Manager", "Data Studio", "Looker"] },
      { category: "Content", items: ["SurferSEO", "Clearscope", "MarketMuse", "Grammarly"] },
    ],
    caseStudies: [
      {
        title: "Organic Traffic Transformation",
        client: "LegalEase Law Firm",
        challenge: "A mid-sized law firm had minimal online visibility and was losing potential clients to competitors ranking higher in search results.",
        solution: "We implemented a comprehensive SEO strategy including technical fixes, content creation, local SEO optimization, and authority building.",
        results: ["250% increase in organic traffic", "Top 3 rankings for 15 target keywords", "180% increase in online inquiries"],
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
      },
    ],
    faqs: [
      { q: "How long does SEO take to show results?", a: "SEO is a long-term strategy. You can expect to see initial improvements within 3 months, with significant results typically appearing after 6-12 months of consistent effort." },
      { q: "Do you guarantee first-page rankings?", a: "No ethical SEO agency can guarantee specific rankings. However, we have a strong track record of achieving top positions for competitive keywords through proven strategies." },
      { q: "What's included in an SEO audit?", a: "Our audit covers technical SEO, on-page optimization, content analysis, backlink profile review, competitor analysis, and actionable recommendations." },
    ],
  },
  {
    slug: "ai-based-app",
    icon: Bot,
    title: "AI Based App",
    seoTitle: "AI-Powered Application Development",
    heroIntro:
      "Leverage the power of artificial intelligence to build intelligent applications that automate processes, enhance decision-making, and deliver personalized user experiences.",
    heroImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    whatWeOffer:
      "We build custom AI-powered applications that transform how businesses operate. From chatbots and virtual assistants to computer vision and predictive analytics, our AI solutions are designed to solve real business problems. We handle the entire lifecycle — from data preparation and model training to deployment and ongoing optimization.",
    benefits: [
      { title: "Custom AI Models", desc: "Tailored machine learning models trained on your specific data and business requirements." },
      { title: "Natural Language Processing", desc: "Build intelligent chatbots, content analyzers, and language understanding systems." },
      { title: "Computer Vision", desc: "Image recognition, object detection, and visual inspection solutions for various industries." },
      { title: "Predictive Analytics", desc: "Forecast trends, customer behavior, and business outcomes with ML-powered predictions." },
      { title: "Process Automation", desc: "Automate repetitive tasks and workflows with intelligent automation powered by AI." },
      { title: "Continuous Learning", desc: "Our AI systems improve over time as they process more data and receive feedback." },
    ],
    technologies: [
      { category: "ML Frameworks", items: ["TensorFlow", "PyTorch", "scikit-learn", "Hugging Face"] },
      { category: "NLP", items: ["OpenAI API", "LangChain", "spaCy", "BERT", "GPT"] },
      { category: "Computer Vision", items: ["OpenCV", "YOLO", "MediaPipe", "TensorFlow Lite"] },
      { category: "Infrastructure", items: ["AWS SageMaker", "Google Cloud AI", "Azure ML", "Docker", "Kubernetes"] },
    ],
    caseStudies: [
      {
        title: "AI Customer Support Bot",
        client: "TeleConnect Services",
        challenge: "A telecom company was overwhelmed by customer support requests, with long wait times and high operational costs.",
        solution: "We built an AI-powered chatbot using NLP that handles 70% of customer queries automatically, with seamless escalation to human agents for complex issues.",
        results: ["70% reduction in support tickets", "Average response time under 5 seconds", "$500K annual savings in support costs"],
        image: "https://images.unsplash.com/photo-1531746790095-e5a5e67bfd0b?w=600&q=80",
      },
    ],
    faqs: [
      { q: "Do I need a lot of data to build an AI app?", a: "It depends on the use case. Some AI solutions can work with small datasets using transfer learning, while others require larger datasets. We'll assess your data during the discovery phase." },
      { q: "How accurate are your AI models?", a: "Accuracy depends on data quality and the problem complexity. We set clear accuracy benchmarks and continuously improve models through retraining and optimization." },
      { q: "Can AI be integrated into my existing app?", a: "Yes, we can add AI capabilities to existing applications through APIs and microservices without requiring a complete rebuild." },
    ],
  },
  {
    slug: "ai-based-saas",
    icon: BrainCircuit,
    title: "AI Based SaaS Products",
    seoTitle: "AI-Powered SaaS Product Development",
    heroIntro:
      "We build scalable, AI-powered SaaS platforms that transform industries. From ideation to launch, we deliver intelligent software products that generate recurring revenue and solve real problems.",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    whatWeOffer:
      "We help entrepreneurs and businesses build AI-powered SaaS products from the ground up. Our team handles everything from market research and product strategy to architecture design, AI model development, and go-to-market execution. We build multi-tenant, scalable platforms that are ready to grow with your user base.",
    benefits: [
      { title: "Multi-Tenant Architecture", desc: "Scalable SaaS architecture that efficiently serves multiple customers with data isolation and security." },
      { title: "AI-Powered Features", desc: "Intelligent features that differentiate your product and provide genuine value to users." },
      { title: "Subscription Management", desc: "Built-in billing, subscription tiers, and usage-based pricing with Stripe integration." },
      { title: "Scalable Infrastructure", desc: "Cloud-native architecture that scales automatically to handle growing user demands." },
      { title: "Analytics Dashboards", desc: "Real-time analytics and reporting dashboards for both you and your customers." },
      { title: "API-First Design", desc: "RESTful and GraphQL APIs that enable integrations and extend your platform's reach." },
    ],
    technologies: [
      { category: "Frontend", items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Recharts"] },
      { category: "Backend", items: ["Node.js", "Python", "FastAPI", "PostgreSQL", "Redis"] },
      { category: "AI/ML", items: ["OpenAI", "LangChain", "TensorFlow", "Hugging Face", "Vector DBs"] },
      { category: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "Stripe", "Auth0"] },
    ],
    caseStudies: [
      {
        title: "ContentAI Writing Platform",
        client: "ContentAI Inc.",
        challenge: "An entrepreneur wanted to build an AI-powered content writing platform that could generate, optimize, and analyze marketing content.",
        solution: "We built a full SaaS platform with AI content generation, SEO analysis, team collaboration features, and tiered subscription plans.",
        results: ["10,000 users within 6 months", "$50K MRR achieved in year one", "Featured in TechCrunch"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
      },
    ],
    faqs: [
      { q: "How long does it take to build an AI SaaS product?", a: "An MVP typically takes 3-4 months. A full-featured product with AI capabilities, billing, and analytics usually takes 6-9 months." },
      { q: "How much does it cost to build a SaaS product?", a: "Costs vary widely based on complexity. We offer transparent pricing and can work within your budget to prioritize features for an MVP approach." },
      { q: "Do you help with go-to-market strategy?", a: "Yes, we provide guidance on product positioning, pricing strategy, and initial marketing to help you launch successfully." },
    ],
  },
];
