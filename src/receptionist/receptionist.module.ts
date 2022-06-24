import { Module } from '@nestjs/common';
import { ReceptionistService } from './receptionist.service';
import { ReceptionistController } from './receptionist.controller';

@Module({
  providers: [ReceptionistService],
  controllers: [ReceptionistController]
})
export class ReceptionistModule {}
