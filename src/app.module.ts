/* eslint-disable */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ClinicModule } from './clinic/clinic.module';
import { DoctorModule } from './doctor/doctor.module';
import { LaboModule } from './labo/labo.module';
import { MailModule } from './mail/mail.module';
import { NurseModule } from './nurse/nurse.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReceptionistModule } from './receptionist/receptionist.module';
import { UserModule } from './user/user.module';
import { GlobalExceptionFilter } from './__shared__/filters/global-exception.filter';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AdminModule,
    ClinicModule,
    ReceptionistModule,
    NurseModule,
    DoctorModule,
    LaboModule,
    MailModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
