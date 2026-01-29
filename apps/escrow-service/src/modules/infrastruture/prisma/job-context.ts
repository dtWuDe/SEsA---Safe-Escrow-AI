// import { Injectable } from "@nestjs/common";
// import { JobContextPort } from "src/modules/ports/job-context.port";

// @Injectable()
// export class JobContenxtHttpAdater extends JobContextPort {
//     async getJobforEscrow(jobId: string)
//     : Promise<{
//         buyerWallet: string
//         sellerWallet: string
//         amount: bigint
//         jobHash: string
//     }> {
//         return await this.prisma.escrow.findUnique({
//             where: { id: jobId },
//             select: {
//                 buyerWallet: true,
//                 sellerWallet: true,
//                 amount: true
//             }
//         })
//     }
// }
