import { Module } from '@nestjs/common';
import { NurseController } from './nurse.controller';
import { NurseService } from './nurse.service';

@Module({
  providers: [NurseService],
  controllers: [NurseController],
})
export class NurseModule {}
