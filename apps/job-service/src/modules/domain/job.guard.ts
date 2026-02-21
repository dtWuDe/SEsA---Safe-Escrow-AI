import { JobStatus } from "generated/prisma/enums";

import { JOB_ALLOWED_TRANSITIONS } from "./job.transitions";

export function assertCanTransition(
    from: JobStatus,
    to: JobStatus
): void {
    const allowed = JOB_ALLOWED_TRANSITIONS[from];
    
    if (!allowed.includes(to)) {
        throw new Error("INVALID_JOB_TRANSITION");
    }
}

export function assertCanSellerAcceptJob(status: JobStatus) {
    assertCanTransition(status, JobStatus.SELECTED);
}

export function assertCanCreateEscrow(status: JobStatus) {
    assertCanTransition(status, JobStatus.ESCROW_PENDING);
}

export function assertCanActivateEscrow(status: JobStatus) {
    assertCanTransition(status, JobStatus.ESCROW_ACTIVE);
}

export function assertCanCompleteJob(status: JobStatus) {
    assertCanTransition(status, JobStatus.COMPLETED);
}

export function assertCanCancelJob(status: JobStatus) {
    assertCanTransition(status, JobStatus.CANCELLED);
}