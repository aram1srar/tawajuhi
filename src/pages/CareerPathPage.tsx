import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CareerPathDetailSection from "@/components/CareerPathDetailSection";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const validPaths = ["general", "cs", "health", "business", "shariah"] as const;

const CareerPathPage: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const navigate = useNavigate();
  const { locale } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (!path || !validPaths.includes(path as any)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Path not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-4 mt-4"
          onClick={() => navigate("/")}
        >
          {locale === "ar" ? (
            <>
              العودة للرئيسية
              <ArrowLeft className="w-4 h-4 ms-2" />
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4 me-2" />
              Back to Home
            </>
          )}
        </Button>
      </div>
      <CareerPathDetailSection pathKey={path as any} index={0} />
      <Footer />
    </div>
  );
};

export default CareerPathPage;
