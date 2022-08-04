import { Module } from '@nestjs/common';
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistService } from './receptionist.service';

@Module({
  providers: [ReceptionistService],
  controllers: [ReceptionistController],
})
export class ReceptionistModule {}
