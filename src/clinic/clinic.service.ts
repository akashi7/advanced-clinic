/* eslint-disable */
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerEmployee } from './dto/clinic.dto';

@Injectable()
export class ClinicService {
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

  //register-user
  async registerUser(dto: registerEmployee, user: User) {
    let isRole: string;
    dto.role === 'receptionist'
      ? (isRole = ERoles.RECEPTIONIST)
      : dto.role === 'doctor'
      ? (isRole = ERoles.DOCTOR)
      : dto.role === 'nurse'
      ? (isRole = ERoles.NURSE)
      : (isRole = ERoles.LABORANTE);
    const isUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (isUser) throw new ConflictException(`${isRole} arleady registered`);
    const passwordGenerated = this.makePassword(8);
    const password = await argon.hash(passwordGenerated);
    const User = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        province: dto.province,
        district: dto.district,
        sector: dto.sector,
        cell: dto.cell,
        village: dto.village,
        contact: dto.contact,
        password,
        role: isRole,
        clinicId: user.id,
      },
    });
    delete User.password;
    await this.mail.sendMail(
      `${User.email}`,
      `${User.fullName} credentials`,
      '"No Reply" <noreply@kuranga.com>',
      `${passwordGenerated}`,
    );
    return User;
  }
}
