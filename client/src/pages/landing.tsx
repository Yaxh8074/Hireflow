import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-semibold">HireFlow</span>
          </div>
          <Button
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Pay-As-You-Go Hiring Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Streamline your hiring process with usage-based pricing. Post jobs, track candidates, 
            and manage hires with no monthly subscriptions—pay only for what you use.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            data-testid="button-get-started"
          >
            Start Hiring Today
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card data-testid="card-feature-job">
            <CardHeader>
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>$25 per Job Post</CardTitle>
              <CardDescription>
                Only pay when you post a job. No upfront costs or monthly fees.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-hire">
            <CardHeader>
              <div className="w-12 h-12 rounded-md bg-chart-2/10 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-chart-2" />
              </div>
              <CardTitle>$100 per Hire</CardTitle>
              <CardDescription>
                Pay for results. Only charged when you successfully hire a candidate.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card data-testid="card-feature-addons">
            <CardHeader>
              <div className="w-12 h-12 rounded-md bg-chart-3/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
              <CardTitle>Modular Add-ons</CardTitle>
              <CardDescription>
                Background checks, skill assessments, and more—available on demand.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16 mb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Why Choose HireFlow?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Applicant Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Track candidates through your hiring pipeline with ease.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  See cost-per-hire metrics and optimize your hiring process.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Hidden Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Transparent pricing. You only pay for services you actually use.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quick Setup</h3>
                <p className="text-sm text-muted-foreground">
                  Start posting jobs and tracking candidates in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2024 HireFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
