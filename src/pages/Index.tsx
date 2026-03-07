import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CareerPathsSection from "@/components/CareerPathsSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import RoleSelectionModal from "@/components/RoleSelectionModal";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("role_confirmed, user_type")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data && !(data as any).role_confirmed) {
          setShowRoleModal(true);
        }
      });
  }, [user]);

  const handleRoleComplete = (role: string) => {
    setShowRoleModal(false);
    if (role === "academic_staff") {
      navigate("/student-results", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CareerPathsSection />
      <FeaturesSection />
      <Footer />
      {showRoleModal && user && (
        <RoleSelectionModal userId={user.id} onComplete={handleRoleComplete} />
      )}
    </div>
  );
};

export default Index;
