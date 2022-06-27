/* eslint-disable */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { ClinicModule } from './clinic/clinic.module';
import { ReceptionistModule } from './receptionist/receptionist.module';
import { NurseModule } from './nurse/nurse.module';
import { DoctorModule } from './doctor/doctor.module';


@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AdminModule, ClinicModule, ReceptionistModule, NurseModule, DoctorModule],
})
export class AppModule { }
