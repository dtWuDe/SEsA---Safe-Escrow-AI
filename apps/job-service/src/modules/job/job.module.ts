import { Module } from "@nestjs/common"
import { JobService } from "../application/job.service";
import { PrismaService } from "../infrastructure/prisma/prisma.service";
import { EscrowHttpClient } from "../infrastructure/http/escrow-api.client";
import { JobRepositoryPort } from "../port/job.repository,port";
import { JobPrismaRepository } from "../infrastructure/prisma/job.repository.prisma";
import { EscrowClientPort } from "../port/escrow-client.port";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from '@nestjs/config';
import { JobController } from "./job.controller";
import { Hasher } from "src/lib/crypto/hasher";

@Module({
    controllers: [JobController],
    imports: [
        HttpModule,
        ConfigModule,
    ],
    providers: [
        JobService,
        PrismaService,
        EscrowHttpClient,
        Hasher,
        {
            provide: JobRepositoryPort,
            useClass: JobPrismaRepository,
        },
        {
            provide: EscrowClientPort,
            useClass: EscrowHttpClient,
        }
    ]
})
export class JobModule {}