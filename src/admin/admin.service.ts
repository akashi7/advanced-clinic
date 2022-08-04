import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Clinic } from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { ClinicDto } from 'src/clinic/dto/clinic.dto';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  makePassword(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  //register- new clinic
  async RegisterClinic(dto: ClinicDto) {
    try {
      const clinicExist = await this.prisma.clinic.findFirst({
        where: {
          OR: [{ clinicCode: dto.clicnicCode, email: dto.email }],
        },
      });
      if (clinicExist)
        throw new ConflictException('Email clinic arleady registered');
      const passwordGenerated = this.makePassword(8);
      const password = await argon.hash(passwordGenerated);
      const clinic = await this.prisma.clinic.create({
        data: {
          name: dto.name,
          province: dto.province,
          district: dto.district,
          sector: dto.sector,
          cell: dto.cell,
          village: dto.village,
          email: dto.email,
          role: ERoles.CLINIC,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          contactName: dto.contactName,
          contactTitle: dto.contactTitle,
          clinicCode: dto.clicnicCode,
        },
      });

      const isUserExist = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      if (isUserExist)
        throw new ConflictException('User by this email arleady exists');
      const User = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
          fullName: dto.name,
          role: ERoles.CLINIC,
          clinicId: clinic.id,
          userId: clinic.id,
        },
      });
      try {
        return this.mail.sendMail(
          clinic.email,
          `${clinic.name} credentials`,
          '"No Reply" <noreply@kuranga.com>',
          `${passwordGenerated}`,
        );
      } catch (error) {
        await this.prisma.clinic.delete({ where: { id: clinic.id } });
        await this.prisma.user.delete({ where: { id: User.id } });
        throw new BadRequestException('Error sending email');
      }
    } catch (error) {
      throw new BadRequestException('ServerError');
    }
  }

  async disableClinic(clinicId: number): Promise<{ message: string }> {
    try {
      await this.prisma.clinic.update({
        where: { id: clinicId },
        data: {
          isActive: false,
        },
      });
      await this.prisma
        .$queryRaw`UPDATE "User" SET "isActive" = ${false} WHERE "clinicId" = ${clinicId}`;

      return {
        message: 'Clinic disabled an its users are disabled',
      };
    } catch (error) {
      throw new BadRequestException('ServerError');
    }
  }

  async enableClinic(clinicId: number): Promise<{ message: string }> {
    try {
      await this.prisma.clinic.update({
        where: { id: clinicId },
        data: {
          isActive: true,
        },
      });
      await this.prisma
        .$queryRaw`UPDATE "User" SET "isActive" = ${true} WHERE "clinicId" = ${clinicId}`;

      return {
        message: 'Clinic enabled an its users are enabled',
      };
    } catch (error) {
      throw new BadRequestException('ServerError');
    }
  }

  async getAllClinics(): Promise<Clinic[]> {
    try {
      const clinics = await this.prisma.clinic.findMany();
      return clinics;
    } catch (error) {
      throw new BadRequestException('ServerError');
    }
  }
}
