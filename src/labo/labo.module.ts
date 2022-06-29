import { Module } from '@nestjs/common';
import { LaboService } from './labo.service';
import { LaboController } from './labo.controller';

@Module({
  providers: [LaboService],
  controllers: [LaboController]
})
export class LaboModule {}
