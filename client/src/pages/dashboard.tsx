import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, CheckCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardStats {
  credits: number;
  activeJobs: number;
  totalCandidates: number;
  monthSpend: number;
  recentHires: number;
  pendingApplications: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: isAuthenticated,
  });

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your hiring overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-credits">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold" data-testid="text-balance">
              ${stats?.credits || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available credits
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-jobs">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <div className="w-8 h-8 rounded-md bg-chart-1/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-chart-1" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-active-jobs">
              {stats?.activeJobs || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently posted
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-candidates">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <div className="w-8 h-8 rounded-md bg-chart-2/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold" data-testid="text-total-candidates">
              {stats?.totalCandidates || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In your database
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-month-spend">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <div className="w-8 h-8 rounded-md bg-chart-3/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold" data-testid="text-month-spend">
              ${stats?.monthSpend || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest hiring metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-chart-2/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm font-medium">Recent Hires</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
              </div>
              <span className="text-2xl font-semibold" data-testid="text-recent-hires">
                {stats?.recentHires || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-chart-3/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm font-medium">Pending Applications</p>
                  <p className="text-xs text-muted-foreground">Awaiting review</p>
                </div>
              </div>
              <span className="text-2xl font-semibold" data-testid="text-pending-apps">
                {stats?.pendingApplications || 0}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/jobs"
              className="flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2 border"
              data-testid="link-post-job"
            >
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="font-medium">Post New Job</span>
            </a>
            <a
              href="/pipeline"
              className="flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2 border"
              data-testid="link-view-pipeline"
            >
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">View Candidate Pipeline</span>
            </a>
            <a
              href="/billing"
              className="flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2 border"
              data-testid="link-add-credits"
            >
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-medium">Add Credits</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
