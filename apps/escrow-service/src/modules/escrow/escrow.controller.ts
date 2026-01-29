import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { EscrowService } from '../application/escrow.service';
import { CreateEscrowIntentDto } from '../dto/create-escrow-intent.dto';
import { SubmitTxDto, ReleaseTxDto } from '../dto/submit-tx.dto';

@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post('intents')
  async createIntent(@Body() dto: CreateEscrowIntentDto) {
    console.log('address', dto.buyerWallet, dto.chainId);
    return this.escrowService.createIntent({
      jobId: dto.jobId,
      buyerWallet: dto.buyerWallet,
      chainId: dto.chainId,
    });
  }

  @Post(':escrowId/submit-tx')
  async submitTx(
    @Param('escrowId') escrowId: string,
    @Body() dto: SubmitTxDto,
  ) {
    return this.escrowService.submitTx({
      escrowId: escrowId,
      txHash: dto.txHash,
    });
  }

  @Post(':escrowId/release-tx')
  async releaseTx(
    @Param('escrowId') escrowId: string,
    @Body() dto: ReleaseTxDto,
  ) {
    return this.escrowService.releaseTx({
      escrowId: escrowId,
      txHash: dto.txHash,
    });
  }

  @Get(':escrowId')
  async getEscrow(@Param('escrowId') escrowId: string) {
    return this.escrowService.getEscrow(escrowId);
  }
}
