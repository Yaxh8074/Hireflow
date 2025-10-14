import {
  users,
  jobs,
  candidates,
  applications,
  transactions,
  services,
  type User,
  type UpsertUser,
  type Job,
  type InsertJob,
  type Candidate,
  type InsertCandidate,
  type Application,
  type InsertApplication,
  type Transaction,
  type InsertTransaction,
  type Service,
  PRICING,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, newBalance: string): Promise<User>;
  
  // Job operations
  getJobs(userId: string): Promise<Job[]>;
  getJob(id: string, userId: string): Promise<Job | undefined>;
  createJob(job: InsertJob, userId: string): Promise<Job>;
  updateJobStatus(id: string, userId: string, status: string): Promise<Job>;
  
  // Candidate operations
  getCandidates(userId: string): Promise<Candidate[]>;
  createCandidate(candidate: InsertCandidate, userId: string): Promise<Candidate>;
  
  // Application operations
  getApplications(userId: string): Promise<any[]>;
  createApplication(application: InsertApplication, userId: string): Promise<Application>;
  updateApplicationStatus(id: string, userId: string, status: string): Promise<Application>;
  
  // Transaction operations
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Analytics
  getAnalytics(userId: string): Promise<any>;
  getDashboardStats(userId: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(userId: string, newBalance: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits: newBalance, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Job operations
  async getJobs(userId: string): Promise<Job[]> {
    return await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, userId))
      .orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string, userId: string): Promise<Job | undefined> {
    const [job] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)));
    return job;
  }

  async createJob(jobData: InsertJob, userId: string): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values({ ...jobData, userId })
      .returning();
    return job;
  }

  async updateJobStatus(id: string, userId: string, status: string): Promise<Job> {
    const now = new Date();
    const updateData: any = { status, updatedAt: now };
    
    if (status === 'active') {
      updateData.postedAt = now;
    } else if (status === 'closed') {
      updateData.closedAt = now;
    }

    const [job] = await db
      .update(jobs)
      .set(updateData)
      .where(and(eq(jobs.id, id), eq(jobs.userId, userId)))
      .returning();
    return job;
  }

  // Candidate operations
  async getCandidates(userId: string): Promise<Candidate[]> {
    return await db
      .select()
      .from(candidates)
      .where(eq(candidates.userId, userId))
      .orderBy(desc(candidates.createdAt));
  }

  async createCandidate(candidateData: InsertCandidate, userId: string): Promise<Candidate> {
    const [candidate] = await db
      .insert(candidates)
      .values({ ...candidateData, userId })
      .returning();
    return candidate;
  }

  // Application operations
  async getApplications(userId: string): Promise<any[]> {
    const result = await db
      .select({
        id: applications.id,
        status: applications.status,
        appliedAt: applications.appliedAt,
        statusChangedAt: applications.statusChangedAt,
        notes: applications.notes,
        job: {
          id: jobs.id,
          title: jobs.title,
        },
        candidate: {
          id: candidates.id,
          firstName: candidates.firstName,
          lastName: candidates.lastName,
          email: candidates.email,
          phone: candidates.phone,
          currentTitle: candidates.currentTitle,
          currentCompany: candidates.currentCompany,
          yearsOfExperience: candidates.yearsOfExperience,
        },
      })
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id))
      .leftJoin(candidates, eq(applications.candidateId, candidates.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.appliedAt));

    return result;
  }

  async createApplication(applicationData: InsertApplication, userId: string): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values({ ...applicationData, userId })
      .returning();
    return application;
  }

  async updateApplicationStatus(id: string, userId: string, status: string): Promise<Application> {
    const [application] = await db
      .update(applications)
      .set({ 
        status, 
        statusChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .returning();
    return application;
  }

  // Transaction operations
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(50);
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  // Analytics
  async getAnalytics(userId: string): Promise<any> {
    const allTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));

    const totalSpend = allTransactions
      .filter(t => parseFloat(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

    const hiredApps = await db
      .select()
      .from(applications)
      .where(and(
        eq(applications.userId, userId),
        eq(applications.status, 'hired')
      ));

    const totalHires = hiredApps.length;
    const costPerHire = totalHires > 0 ? totalSpend / totalHires : 0;

    const allApps = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, userId));

    const totalApplications = allApps.length;
    const conversionRate = totalApplications > 0 ? (totalHires / totalApplications) * 100 : 0;

    // Calculate average time to hire
    let avgTimeToHire = 0;
    if (hiredApps.length > 0) {
      const totalDays = hiredApps.reduce((sum, app) => {
        const applied = new Date(app.appliedAt);
        const hired = new Date(app.statusChangedAt);
        const days = Math.floor((hired.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      avgTimeToHire = Math.floor(totalDays / hiredApps.length);
    }

    const activeJobs = await db
      .select()
      .from(jobs)
      .where(and(
        eq(jobs.userId, userId),
        eq(jobs.status, 'active')
      ));

    return {
      totalSpend,
      totalHires,
      costPerHire,
      avgTimeToHire,
      conversionRate,
      activeJobsCount: activeJobs.length,
      totalApplications,
    };
  }

  async getDashboardStats(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    
    const activeJobs = await db
      .select()
      .from(jobs)
      .where(and(
        eq(jobs.userId, userId),
        eq(jobs.status, 'active')
      ));

    const totalCandidates = await db
      .select({ count: sql<number>`count(*)` })
      .from(candidates)
      .where(eq(candidates.userId, userId));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthTransactions = await db
      .select()
      .from(transactions)
      .where(and(
        eq(transactions.userId, userId),
        gte(transactions.createdAt, thirtyDaysAgo)
      ));

    const monthSpend = monthTransactions
      .filter(t => parseFloat(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

    const recentHires = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(and(
        eq(applications.userId, userId),
        eq(applications.status, 'hired'),
        gte(applications.statusChangedAt, thirtyDaysAgo)
      ));

    const pendingApps = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(and(
        eq(applications.userId, userId),
        eq(applications.status, 'applied')
      ));

    return {
      credits: user?.credits || "0.00",
      activeJobs: activeJobs.length,
      totalCandidates: totalCandidates[0]?.count || 0,
      monthSpend: monthSpend.toFixed(2),
      recentHires: recentHires[0]?.count || 0,
      pendingApplications: pendingApps[0]?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
