import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Briefcase } from "lucide-react";

interface ApplicationWithDetails {
  id: string;
  status: string;
  appliedAt: string;
  job: {
    title: string;
  };
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    currentTitle: string | null;
    yearsOfExperience: number | null;
  };
}

const STATUSES = [
  { value: "applied", label: "Applied", color: "secondary" },
  { value: "screening", label: "Screening", color: "default" },
  { value: "interview", label: "Interview", color: "default" },
  { value: "offer", label: "Offer", color: "default" },
  { value: "hired", label: "Hired", color: "default" },
];

export default function Pipeline() {
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

  const { data: applications, isLoading } = useQuery<ApplicationWithDetails[]>({
    queryKey: ["/api/applications"],
    enabled: isAuthenticated,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }: { applicationId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/applications/${applicationId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  const groupedApplications = STATUSES.reduce((acc, status) => {
    acc[status.value] = applications?.filter(app => app.status === status.value) || [];
    return acc;
  }, {} as Record<string, ApplicationWithDetails[]>);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Candidate Pipeline</h1>
        <p className="text-muted-foreground">Track candidates through your hiring process</p>
      </div>

      {applications && applications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-sm text-muted-foreground">Applications will appear here once candidates apply</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {STATUSES.map((status) => (
            <div key={status.value} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{status.label}</h3>
                <Badge variant="secondary" data-testid={`badge-count-${status.value}`}>
                  {groupedApplications[status.value].length}
                </Badge>
              </div>
              <div className="space-y-3">
                {groupedApplications[status.value].map((app) => (
                  <Card key={app.id} className="hover-elevate" data-testid={`card-application-${app.id}`}>
                    <CardHeader className="p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1">
                            {app.candidate.firstName} {app.candidate.lastName}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {app.job.title}
                          </p>
                          <div className="space-y-1">
                            {app.candidate.currentTitle && (
                              <p className="text-xs flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                <span className="line-clamp-1">{app.candidate.currentTitle}</span>
                              </p>
                            )}
                            <p className="text-xs flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span className="line-clamp-1">{app.candidate.email}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <select
                        className="w-full text-xs p-2 rounded-md border bg-background"
                        value={app.status}
                        onChange={(e) => updateStatusMutation.mutate({
                          applicationId: app.id,
                          status: e.target.value
                        })}
                        disabled={updateStatusMutation.isPending}
                        data-testid={`select-status-${app.id}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
