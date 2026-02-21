import { JobStatus } from "generated/prisma/enums";
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { 
    assertCanCreateEscrow, 
    assertCanSellerAcceptJob, 
    assertCanActivateEscrow, 
    assertCanCancelJob, 
    assertCanCompleteJob 
} from "./job.guard";


export interface JobProps {
    id: string;
    jobCommitment: string | null;
    description: string;
    jobStatus: JobStatus;
    buyerUserId: string;
    buyerWallet: string;
    sellerUserId: string | null;
    sellerWallet: string | null;
    escrowId: string | null;
    amount: bigint;
    createdAt: Date;
    expiriesAt: Date;
    cancelledAt: Date | null;

}

@Entity('jobs')
export class Job {
    @PrimaryColumn('uuid')
    public readonly id: string;

    public jobCommitment: string | null;
    public description: string;
    public jobStatus: JobStatus;
    public readonly buyerUserId: string;
    public readonly buyerWallet: string;
    public sellerUserId: string | null;
    public sellerWallet: string | null;
    public escrowId: string | null;
    public amount: bigint;
    public readonly createdAt: Date;
    public readonly expiriesAt: Date;
    public cancelledAt: Date | null;

    private constructor(props: JobProps) {
        this.id = props.id;
        this.jobCommitment = props.jobCommitment;
        this.description = props.description;
        this.jobStatus = props.jobStatus;
        this.buyerUserId = props.buyerUserId;
        this.buyerWallet = props.buyerWallet;
        this.sellerUserId = props.sellerUserId;
        this.sellerWallet = props.sellerWallet;
        this.escrowId = props.escrowId;
        this.amount = props.amount;
        this.createdAt = props.createdAt;
        this.expiriesAt = props.expiriesAt;
        this.cancelledAt = props.cancelledAt;
    }

    static reconstitute(props: JobProps): Job {
        return new Job(props);
    }

    static create(params: {
        description: string;
        buyerUserId: string;
        buyerAddress: string;
        amount: bigint;
        expiriesAt: Date;
    }): Job {
        // Validation
        if (!params.description?.trim()) {
            throw new Error('Description is required');
        }
        if (params.expiriesAt <= new Date()) {
            throw new Error('Expiry date must be in the future');
        }

        return new Job({
            id: uuid(),
            jobCommitment: null,
            description: params.description,
            jobStatus: JobStatus.INIT,
            buyerUserId: params.buyerUserId,
            buyerWallet: params.buyerAddress,
            sellerUserId: null,
            sellerWallet: null,
            escrowId: null,
            amount: params.amount,
            createdAt: new Date(),
            expiriesAt: params.expiriesAt,
            cancelledAt: null,
        });
    }

    get status(): JobStatus {
        return this.jobStatus; 
    }

    setJobCommitment(jobCommitment: string): void {
        this.jobCommitment = jobCommitment;
    }

    jobCreated(): void {
        this.jobStatus = JobStatus.WAITING_SELLER;
    }

    sellerAccept(sellerUserId: string, sellerWallet: string) {
        assertCanSellerAcceptJob(this.jobStatus);
        this.jobStatus = JobStatus.SELECTED;
        this.sellerUserId = sellerUserId;
        this.sellerWallet = sellerWallet;  
    }

    createEscrow(escrowId: string): void {
        assertCanCreateEscrow(this.jobStatus);
        this.jobStatus = JobStatus.ESCROW_PENDING;
        this.escrowId = escrowId;
    }

    pendingEscrow(): void {
        assertCanCreateEscrow(this.jobStatus);
        this.jobStatus = JobStatus.ESCROW_PENDING;
    }

    activateEscrow(escrowId: string): void {
        assertCanActivateEscrow(this.jobStatus);
        this.escrowId = escrowId;
        this.jobStatus = JobStatus.ESCROW_ACTIVE;
    }

    cancelJob(): void {
        assertCanCancelJob(this.jobStatus);
        this.jobStatus = JobStatus.CANCELLED;
        this.cancelledAt = new Date();
    }

    completeJob(): void {
        assertCanCompleteJob(this.jobStatus);
        this.jobStatus = JobStatus.COMPLETED;
    }

    canUpdate(): boolean {
        const nonUpdatableStatuses: JobStatus[] = [
            JobStatus.COMPLETED,
            JobStatus.CANCELLED,
            JobStatus.DISPUTED
        ];
        
        return !nonUpdatableStatuses.includes(this.jobStatus);
    }
}