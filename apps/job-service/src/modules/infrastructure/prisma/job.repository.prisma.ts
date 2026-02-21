import { JobRepositoryPort } from "src/modules/port/job.repository,port";
import { Job } from "../../domain/job.entity";
import { PrismaService } from "./prisma.service";
import { Injectable } from "@nestjs/common";
import { Job as PrismaJob } from "generated/prisma/client";

@Injectable()
export class JobPrismaRepository extends JobRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    )
    {
        super();
    }

    async save(job: Job): Promise<Job> {
        const data = {
            jobCommitment: job.jobCommitment,
            description: job.description,
            jobStatus: job.jobStatus,
            buyerUserId: job.buyerUserId,
            buyerWallet: job.buyerWallet,
            sellerUserId: job.sellerUserId,
            sellerWallet: job.sellerWallet,
            escrowId: job.escrowId,
            amount: job.amount,
            createdAt: job.createdAt,
            expiresAt: job.expiriesAt,
            cancelledAt: job.cancelledAt
        };
        const row = await this.prisma.job.upsert({
            where: { id: job.id },
            create: {
                id: job.id,
                ...data
            },
            update: data
        });

        return this.toDomain(row)
    }

    async findById(jobId: string): Promise<Job | null> {
        const row = await this.prisma.job.findUnique({
            where: { id: jobId }
        })

        if (!row) return null;
        
        return this.toDomain(row);
    }

    async delete(jobId: string): Promise<void> {
        await this.prisma.job.delete({
            where: { id: jobId }
        });
    }

    async findAll(): Promise<Job[]> {
        const rows =  await this.prisma.job.findMany();
        return rows.map(row => this.toDomain(row));
    }

    private toDomain(row: PrismaJob): Job {
        return Job.reconstitute({
            id: row.id,
            jobCommitment: row.jobCommitment,
            description: row.description,
            jobStatus: row.jobStatus,
            buyerUserId: row.buyerUserId,
            buyerWallet: row.buyerWallet,
            sellerUserId: row.sellerUserId,
            sellerWallet: row.sellerWallet,
            escrowId: row.escrowId,
            amount: row.amount,
            createdAt: row.createdAt,
            expiriesAt: row.expiresAt, 
            cancelledAt: row.cancelledAt
        });
    }
}


