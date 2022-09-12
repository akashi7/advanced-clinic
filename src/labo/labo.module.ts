import { Module } from '@nestjs/common';
import { LaboController } from './labo.controller';
import { LaboService } from './labo.service';

@Module({
  providers: [LaboService],
  controllers: [LaboController],
})
export class LaboModule {}
