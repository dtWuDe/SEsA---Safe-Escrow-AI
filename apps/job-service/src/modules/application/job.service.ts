import { Injectable } from "@nestjs/common";
import { JobRepositoryPort } from "../port/job.repository,port";
import { CreateJobDto, AcceptSellerDto, JobFundedDto } from "../dto/create-job.dto";
import { Job } from "../domain/job.entity";
import { EscrowHttpClient } from "../infrastructure/http/escrow-api.client";
import { JobStatus } from "generated/prisma/enums";
import { CreateEscrowIntent } from "../port/escrow-client.port";
import { Hasher } from "src/lib/crypto/hasher";
import { privateDecrypt } from "crypto";
import { CreateEscrowIntentDto } from "../dto/create-intent.dto";

@Injectable() 
export class JobService {
    constructor(
        private readonly jobRepository: JobRepositoryPort,
        private readonly escrowHttpClient: EscrowHttpClient,
        private readonly hasher: Hasher
    ) {}

    async createJob(jobDto: CreateJobDto): Promise<Job> {
        const newJob = Job.create({
            description: jobDto.description,
            buyerUserId: jobDto.buyerUserId,
            buyerAddress: jobDto.buyerAddress,
            amount: jobDto.amount,
            expiriesAt: jobDto.expiriesAt,
        })

        const jobHash = await this.createJobCommitment(newJob.id, jobDto);

        newJob.setJobCommitment(jobHash);

        newJob.jobCreated();

        return this.jobRepository.save(newJob);
    }

    async acceptJobBySeller(jobId: string, dto: AcceptSellerDto): Promise<void> {
        const job = await this.jobRepository.findById(jobId);

        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }

        job.sellerAccept(dto.sellerUserId, dto.sellerWallet);

        await this.jobRepository.save(job);
    }

    async createEscrowForJob(jobId: string, dto: CreateEscrowIntentDto): Promise<any> {
        const job =  await this.jobRepository.findById(jobId);

        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }

        job.pendingEscrow();
        
        const createEscrowRes = await this.escrowHttpClient.createEscrow({
            jobId: jobId,
            chainId: dto.chainId,
            buyerUserId: job.buyerUserId,
            sellerUserId: job.sellerUserId!,
            buyerWallet: job.buyerWallet,
            sellerWallet: job.sellerWallet!,
            arbitratorWallet: dto.arbitratorWallet,
            amount: job.amount,
            jobHash: job.jobCommitment!
        });

        await this.jobRepository.save(job);

        return createEscrowRes;
    }

    async jobFunded(jobId: string, jobfunded: JobFundedDto): Promise<void> {
        const job = await this.jobRepository.findById(jobId);
        
        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }
        
        if (job.escrowId !== jobfunded.escrowId && job.jobCommitment !== jobfunded.jobHash) {
            throw new Error("ESCROW_JOB_MISMATCH");
        }

        const event = await this.escrowHttpClient.getChainEventByTxHash(jobfunded.txHash);

        if (!event) {
            throw new Error("ESCROW_EVENT_NOT_FOUND");
        }

        job.activateEscrow(job.escrowId!);
        
        await this.jobRepository.save(job);
    }

    async completeJob(jobId: string): Promise<void> {
        const job = await this.jobRepository.findById(jobId);

        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }

        job.completeJob();

        await this.jobRepository.save(job);
    }

    async cancelJob(jobId: string): Promise<void> {
        const job = await this.jobRepository.findById(jobId);

        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }

        job.cancelJob();

        await this.jobRepository.save(job);
    }

    async requestRelease(escrowId: string, jobId: string): Promise<void> {
        const escrow = await this.escrowHttpClient.getEscrow(escrowId);

        if (!escrow) {
            throw new Error("ESCROW_NOT_FOUND");
        }

        const job = await this.jobRepository.findById(jobId);

        if (!job) {
            throw new Error("JOB_NOT_FOUND");
        }

        const jobCommitment = job.jobCommitment;
        if (escrow.jobCommitment !== jobCommitment) {
            throw new Error("ESCROW_JOB_MISMATCH");
        }
        
        try {
            await this.escrowHttpClient.releaseTx(escrowId, {
                txHash: escrow.releaseTxHash
            });

            job.completeJob();
            await this.jobRepository.save(job);
        } catch (error) {
            throw new Error("ESCROW_RELEASE_FAILED");
        }
    }

    async findById(jobId: string): Promise<Job | null> {
        return this.jobRepository.findById(jobId);
    }

    async findAll(): Promise<Job[]> {
        return this.jobRepository.findAll();
    }

    async createJobCommitment(jobId: string, jobDto: CreateJobDto): Promise<string> {
        return await this.hasher.hash(
            `${jobId} | ${jobDto.buyerUserId} | ${jobDto.amount} | ${jobDto.expiriesAt}`
        )
    }
}
