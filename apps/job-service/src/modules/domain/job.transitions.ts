import { JobStatus } from "generated/prisma/enums"

export const JOB_ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
    [JobStatus.INIT]: [JobStatus.WAITING_SELLER],
    [JobStatus.WAITING_SELLER]: [JobStatus.SELECTED],
    [JobStatus.SELECTED]: [JobStatus.ESCROW_PENDING],
    [JobStatus.ESCROW_PENDING]: [JobStatus.ESCROW_ACTIVE],
    [JobStatus.ESCROW_ACTIVE]: [JobStatus.COMPLETED, JobStatus.CANCELLED, JobStatus.DISPUTED],
    [JobStatus.COMPLETED]: [],
    [JobStatus.CANCELLED]: [],
    [JobStatus.DISPUTED]: []
}