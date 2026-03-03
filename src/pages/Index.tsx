import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CareerPathsSection from "@/components/CareerPathsSection";
import CareerPathDetailSection from "@/components/CareerPathDetailSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const paths = ["general", "cs", "health", "business", "shariah"] as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CareerPathsSection />
      {paths.map((path, index) => (
        <CareerPathDetailSection key={path} pathKey={path} index={index} />
      ))}
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
