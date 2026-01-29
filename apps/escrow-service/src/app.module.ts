import { Module } from '@nestjs/common';
import { EscrowModule } from './modules/escrow/escrow.module';

@Module({
  imports: [EscrowModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
