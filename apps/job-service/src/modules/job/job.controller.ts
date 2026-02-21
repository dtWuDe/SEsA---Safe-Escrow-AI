import { Controller, Post, Get, Patch, Param, Body } from "@nestjs/common";
import { JobService } from "../application/job.service";
import { CreateJobDto, AcceptSellerDto, JobFundedDto } from "../dto/create-job.dto";
import { Job } from "../domain/job.entity";
import { CreateEscrowIntentDto } from "../dto/create-intent.dto";
import { PrepareEscrowRes } from "../dto/prepare-escrow.res";
import { EscrowIntentResponse } from "../port/escrow-client.port";

@Controller('jobs')
export class JobController {
    constructor(
        private readonly jobService: JobService
    ) {}

    @Post('create')
    async createJob(
        @Body() dto: CreateJobDto
    ): Promise<Job> {
        return this.jobService.createJob(dto);
    }

    @Post(':id/accept')
    async acceptJobBySeller(
        @Param('id') id: string,
        @Body() dto: AcceptSellerDto
    ): Promise<void> {
        return this.jobService.acceptJobBySeller(id, dto);
    }

    @Post(':id/job-funded')
    async jobFunded(
        @Param('id') id: string,
        @Body() dto: JobFundedDto,
    ): Promise<void> {
        return this.jobService.jobFunded(id, dto);
    }

    @Get(':id')
    async findById(
        @Param('id') id: string
    ): Promise<Job | null> {
        return this.jobService.findById(id);
    }

    @Post(':id/prepare-escrow')
    async prepareEscrow(
        @Param('id') id: string,
        @Body() dto: CreateEscrowIntentDto
    ): Promise<EscrowIntentResponse> {
        return this.jobService.createEscrowForJob(id, dto);
    }
}
