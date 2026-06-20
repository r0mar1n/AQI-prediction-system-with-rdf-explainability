import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, TrendingUp, Shield, Brain } from "lucide-react";
import IndiaMapSection from "@/components/home/IndiaMapSection";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const features = [
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "24/7 tracking of PM2.5, PM10, NO₂, SO₂, CO, and O₃ levels",
    },
    {
      icon: TrendingUp,
      title: "24-Hour Predictions",
      description: "AI-powered predictions using LSTM, GRU, and CNN-LSTM models",
    },
    {
      icon: Shield,
      title: "Smart Alerts",
      description: "Instant notifications when pollution levels exceed safe thresholds",
    },
    {
      icon: Brain,
      title: "Model Insights",
      description: "Explainable AI for transparency",
    },
  ];

  const stats = [
    { label: "Pollutants Tracked", value: "6", unit: "types" },
    { label: "Prediction Window", value: "24", unit: "hours" },
    { label: "Model Accuracy", value: "94", unit: "%" },
    { label: "Update Frequency", value: "5", unit: "min" },
  ];

  const scrollToMap = () => {
    const el = document.getElementById("map-section");
    el?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      document.getElementById("city-search")?.focus();
    }, 400);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("scrollToMap")) {
      setTimeout(() => {
        document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location]);

  return (
    <div className="space-y-8">

      {/* Hero */}
      <div className="relative z-[10] overflow-hidden rounded-2xl bg-gradient-primary p-8 md:p-12 shadow-card">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Air Quality Prediction System
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-6">
            Predict pollution levels using advanced AI models and stay informed.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="gap-2"
              onClick={scrollToMap}
            >
              View Map
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Link to="/insights">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Map */}
      <div id="map-section" className="relative z-[1]">
        <IndiaMapSection />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stat.value}
              <span className="text-lg text-muted-foreground ml-1">
                {stat.unit}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Key Features
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 hover:shadow-card-hover">
              <div className="flex gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Start Monitoring Today
        </h2>
        <Button onClick={scrollToMap}>
          Go to Map
        </Button>
      </Card>
    </div>
  );
}