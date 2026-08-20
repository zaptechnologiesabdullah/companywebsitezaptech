import Header from "@/components/Header";
import AboutHero from "@/components/about/AboutHero";
import AboutMission from "@/components/about/AboutMission";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutJourney from "@/components/about/AboutJourney";
import AboutAchievements from "@/components/about/AboutAchievements";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutTeam />
      <AboutJourney />
      <AboutAchievements />
      <CTASection />
      <Footer />
    </div>
  );
};

export default About;
