import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJobSchema, insertCandidateSchema, insertApplicationSchema, PRICING } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Job routes
  app.get('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobs = await storage.getJobs(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.post('/api/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData, userId);
      res.json(job);
    } catch (error: any) {
      console.error("Error creating job:", error);
      res.status(400).json({ message: error.message || "Failed to create job" });
    }
  });

  app.patch('/api/jobs/:id/publish', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const jobId = req.params.id;

      // Get user balance
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.credits);
      if (currentBalance < PRICING.JOB_POST) {
        return res.status(400).json({ message: "Insufficient credits" });
      }

      // Update job status
      const job = await storage.updateJobStatus(jobId, userId, 'active');

      // Deduct credits and create transaction
      const newBalance = (currentBalance - PRICING.JOB_POST).toFixed(2);
      await storage.updateUserCredits(userId, newBalance);

      await storage.createTransaction({
        userId,
        type: 'job_post',
        description: `Posted job: ${job.title}`,
        amount: (-PRICING.JOB_POST).toString(),
        balanceAfter: newBalance,
        relatedJobId: jobId,
        relatedApplicationId: null,
        relatedServiceId: null,
      });

      res.json(job);
    } catch (error: any) {
      console.error("Error publishing job:", error);
      res.status(500).json({ message: error.message || "Failed to publish job" });
    }
  });

  // Candidate routes
  app.get('/api/candidates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const candidates = await storage.getCandidates(userId);
      res.json(candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ message: "Failed to fetch candidates" });
    }
  });

  app.post('/api/candidates', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(validatedData, userId);
      res.json(candidate);
    } catch (error: any) {
      console.error("Error creating candidate:", error);
      res.status(400).json({ message: error.message || "Failed to create candidate" });
    }
  });

  // Application routes
  app.get('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applications = await storage.getApplications(userId);
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData, userId);
      res.json(application);
    } catch (error: any) {
      console.error("Error creating application:", error);
      res.status(400).json({ message: error.message || "Failed to create application" });
    }
  });

  app.patch('/api/applications/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationId = req.params.id;
      const { status } = req.body;

      // Update application status
      const application = await storage.updateApplicationStatus(applicationId, userId, status);

      // If status is 'hired', charge the hire fee
      if (status === 'hired') {
        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const currentBalance = parseFloat(user.credits);
        if (currentBalance < PRICING.SUCCESSFUL_HIRE) {
          return res.status(400).json({ message: "Insufficient credits for hire fee" });
        }

        const newBalance = (currentBalance - PRICING.SUCCESSFUL_HIRE).toFixed(2);
        await storage.updateUserCredits(userId, newBalance);

        await storage.createTransaction({
          userId,
          type: 'hire',
          description: `Successful hire fee`,
          amount: (-PRICING.SUCCESSFUL_HIRE).toString(),
          balanceAfter: newBalance,
          relatedJobId: application.jobId,
          relatedApplicationId: applicationId,
          relatedServiceId: null,
        });
      }

      res.json(application);
    } catch (error: any) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: error.message || "Failed to update application status" });
    }
  });

  // Transaction routes
  app.get('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Credits routes
  app.post('/api/credits/add', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentBalance = parseFloat(user.credits);
      const newBalance = (currentBalance + amount).toFixed(2);

      await storage.updateUserCredits(userId, newBalance);

      await storage.createTransaction({
        userId,
        type: 'credit_purchase',
        description: `Added credits`,
        amount: amount.toString(),
        balanceAfter: newBalance,
        relatedJobId: null,
        relatedApplicationId: null,
        relatedServiceId: null,
      });

      res.json({ success: true, newBalance });
    } catch (error: any) {
      console.error("Error adding credits:", error);
      res.status(500).json({ message: error.message || "Failed to add credits" });
    }
  });

  // Analytics routes
  app.get('/api/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
