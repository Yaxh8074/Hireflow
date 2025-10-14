import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: string;
  balanceAfter: string;
  createdAt: string;
}

export default function Billing() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState("50");

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

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    enabled: isAuthenticated,
  });

  const addCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      return await apiRequest("POST", "/api/credits/add", { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Credits Added",
        description: `$${creditAmount} has been added to your account.`,
      });
      setCreditAmount("50");
      setIsDialogOpen(false);
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
        description: error.message || "Failed to add credits",
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Billing & Usage</h1>
          <p className="text-muted-foreground">Manage your account balance and view transaction history</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-credits">
              <Plus className="w-4 h-4 mr-2" />
              Add Credits
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Credits</DialogTitle>
              <DialogDescription>
                Add credits to your account to use HireFlow services
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ($)</label>
                <Input
                  type="number"
                  placeholder="50"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  min="1"
                  step="1"
                  data-testid="input-credit-amount"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreditAmount("50")}
                  data-testid="button-preset-50"
                >
                  $50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreditAmount("100")}
                  data-testid="button-preset-100"
                >
                  $100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreditAmount("250")}
                  data-testid="button-preset-250"
                >
                  $250
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreditAmount("500")}
                  data-testid="button-preset-500"
                >
                  $500
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => addCreditsMutation.mutate(parseFloat(creditAmount))}
                disabled={addCreditsMutation.isPending || !creditAmount || parseFloat(creditAmount) <= 0}
                data-testid="button-confirm-add-credits"
              >
                {addCreditsMutation.isPending ? "Processing..." : `Add $${creditAmount}`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>Your available credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="text-4xl font-mono font-semibold" data-testid="text-current-balance">
                ${user?.credits || "0.00"}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Available for services</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your recent billing activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions?.map((transaction) => {
                const isCredit = parseFloat(transaction.amount) > 0;
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-md border hover-elevate"
                    data-testid={`transaction-${transaction.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        isCredit ? 'bg-chart-2/10' : 'bg-chart-5/10'
                      }`}>
                        {isCredit ? (
                          <TrendingUp className="w-5 h-5 text-chart-2" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-chart-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()} at{" "}
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${
                        isCredit ? 'text-chart-2' : 'text-foreground'
                      }`}>
                        {isCredit ? '+' : ''}{transaction.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance: ${transaction.balanceAfter}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
