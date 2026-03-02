import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CareerPathsSection from "@/components/CareerPathsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CareerPathsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Index;
