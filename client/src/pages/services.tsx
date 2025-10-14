import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Target, Video } from "lucide-react";
import { PRICING } from "@shared/schema";

export default function Services() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const services = [
    {
      id: "background-check",
      name: "Background Check",
      description: "Comprehensive background screening including criminal records, employment history, and education verification.",
      category: "screening",
      price: PRICING.BACKGROUND_CHECK,
      icon: Shield,
      features: [
        "Criminal record check",
        "Employment verification",
        "Education verification",
        "Reference checks",
        "Results in 2-5 business days",
      ],
    },
    {
      id: "skill-assessment",
      name: "Skill Assessment",
      description: "Technical and soft skills testing to evaluate candidate competencies and job fit.",
      category: "assessment",
      price: PRICING.SKILL_ASSESSMENT,
      icon: Target,
      features: [
        "Technical skill tests",
        "Cognitive ability tests",
        "Personality assessments",
        "Custom test creation",
        "Instant results",
      ],
    },
    {
      id: "video-interview",
      name: "Video Interview Platform",
      description: "One-way video interview platform for asynchronous candidate screening.",
      category: "interview",
      price: PRICING.VIDEO_INTERVIEW,
      icon: Video,
      features: [
        "Customizable questions",
        "Unlimited review time",
        "Share with team",
        "AI-powered transcription",
        "Valid for 30 days",
      ],
    },
  ];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Service Marketplace</h1>
        <p className="text-muted-foreground">Enhance your hiring process with add-on services</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.id} className="flex flex-col" data-testid={`card-service-${service.id}`}>
              <CardHeader>
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge variant="secondary" className="font-mono" data-testid={`badge-price-${service.id}`}>
                    ${service.price}
                  </Badge>
                </div>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-2 flex-1 mb-4">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-chart-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid={`button-learn-more-${service.id}`}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pricing Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Overview</CardTitle>
          <CardDescription>All service pricing at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="font-medium">Job Post</span>
              <span className="font-mono font-semibold">${PRICING.JOB_POST}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="font-medium">Successful Hire</span>
              <span className="font-mono font-semibold">${PRICING.SUCCESSFUL_HIRE}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="font-medium">Background Check</span>
              <span className="font-mono font-semibold">${PRICING.BACKGROUND_CHECK}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="font-medium">Skill Assessment</span>
              <span className="font-mono font-semibold">${PRICING.SKILL_ASSESSMENT}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md border">
              <span className="font-medium">Video Interview</span>
              <span className="font-mono font-semibold">${PRICING.VIDEO_INTERVIEW}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
