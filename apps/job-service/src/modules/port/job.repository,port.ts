import { EnumJobStatusFilter } from "generated/prisma/commonInputTypes";
import { Job } from "../domain/job.entity";
import { CreateJobDto } from "../dto/create-job.dto";

export abstract class JobRepositoryPort {
    abstract findById(jobId: string): Promise<Job | null>;
    abstract save(job: Job): Promise<Job>;
    abstract delete(jobId: string): Promise<void>;
    abstract findAll(): Promise<Job[]>;
    

}