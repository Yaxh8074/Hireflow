import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react";

interface AnalyticsData {
  totalSpend: number;
  totalHires: number;
  costPerHire: number;
  avgTimeToHire: number;
  conversionRate: number;
  activeJobsCount: number;
  totalApplications: number;
}

export default function Analytics() {
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

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your hiring performance and ROI</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-cost-per-hire">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Hire</CardTitle>
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold" data-testid="text-cost-per-hire">
              ${analytics?.costPerHire.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average cost per successful hire
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-hires">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hires</CardTitle>
            <div className="w-8 h-8 rounded-md bg-chart-2/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-total-hires">
              {analytics?.totalHires || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-conversion-rate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <div className="w-8 h-8 rounded-md bg-chart-3/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-conversion-rate">
              {analytics?.conversionRate.toFixed(1) || "0.0"}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Applications to hires
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-avg-time">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Hire</CardTitle>
            <div className="w-8 h-8 rounded-md bg-chart-4/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-avg-time">
              {analytics?.avgTimeToHire || 0} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From application to hire
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hiring Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Hiring Funnel</CardTitle>
          <CardDescription>Track your candidate journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Applications</span>
                <span className="text-sm font-semibold">{analytics?.totalApplications || 0}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-chart-1 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Jobs</span>
                <span className="text-sm font-semibold">{analytics?.activeJobsCount || 0}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-chart-2 h-2 rounded-full"
                  style={{
                    width: analytics?.totalApplications
                      ? `${(analytics.activeJobsCount / analytics.totalApplications * 100).toFixed(0)}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Successful Hires</span>
                <span className="text-sm font-semibold">{analytics?.totalHires || 0}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-chart-2 h-2 rounded-full"
                  style={{
                    width: analytics?.totalApplications
                      ? `${(analytics.totalHires / analytics.totalApplications * 100).toFixed(0)}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Overview</CardTitle>
          <CardDescription>Your total platform investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-4xl font-mono font-semibold" data-testid="text-total-spend">
                ${analytics?.totalSpend.toFixed(2) || "0.00"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total spent on HireFlow</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
