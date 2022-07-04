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

  async RegisterUserToDataBase(
    role: string,
    email: string,
    password: string,
    fullName: string,
    clinicId: number,
    userId: number,
    passwordGenerated: string,
  ) {
    const User = await this.prisma.user.create({
      data: {
        email,
        password,
        fullName,
        role,
        clinicId,
        userId,
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

  //Register-user
  async RegisterUser(dto: registerEmployee, user: User): Promise<User> {
    let isRole: string;
    dto.role === 'receptionist'
      ? (isRole = ERoles.RECEPTIONIST)
      : dto.role === 'doctor'
      ? (isRole = ERoles.DOCTOR)
      : dto.role === 'nurse'
      ? (isRole = ERoles.NURSE)
      : (isRole = ERoles.LABORANTE);
    const isUser = await this.prisma.user.findFirst({
      where: { email: dto.email, AND: [{ clinicId: user.userId }] },
    });
    if (isUser) throw new ConflictException(`${isRole} arleady registered`);
    if (isRole === ERoles.RECEPTIONIST) {
      const isReceptionist = await this.prisma.receptionist.findFirst({
        where: { email: dto.email },
      });
      if (isReceptionist)
        throw new ConflictException('Receptionist already registered');
      const passwordGenerated = this.makePassword(8);
      const password = await argon.hash(passwordGenerated);
      const receptionist = await this.prisma.receptionist.create({
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
      return this.RegisterUserToDataBase(
        'receptionist',
        dto.email,
        password,
        dto.fullName,
        user.userId,
        receptionist.id,
        passwordGenerated,
      );
    }
    if (isRole === ERoles.DOCTOR) {
      const isDoctor = await this.prisma.doctor.findFirst({
        where: { email: dto.email },
      });
      if (isDoctor) throw new ConflictException('Doctor already registered');
      const passwordGenerated = this.makePassword(8);
      const password = await argon.hash(passwordGenerated);
      const doctor = await this.prisma.doctor.create({
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

      return this.RegisterUserToDataBase(
        'doctor',
        dto.email,
        password,
        dto.fullName,
        user.userId,
        doctor.id,
        passwordGenerated,
      );
    }
    if (isRole === ERoles.NURSE) {
      const isNurse = await this.prisma.nurse.findFirst({
        where: { email: dto.email },
      });
      if (isNurse) throw new ConflictException('Nurse already registered');
      const passwordGenerated = this.makePassword(8);
      const password = await argon.hash(passwordGenerated);
      const nurse = await this.prisma.nurse.create({
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
      return this.RegisterUserToDataBase(
        'nurse',
        dto.email,
        password,
        dto.fullName,
        user.userId,
        nurse.id,
        passwordGenerated,
      );
    }
    if (isRole === ERoles.LABORANTE) {
      const isLaborante = await this.prisma.laborante.findFirst({
        where: { email: dto.email },
      });
      if (isLaborante)
        throw new ConflictException('Laborante already registered');
      const passwordGenerated = this.makePassword(8);
      const password = await argon.hash(passwordGenerated);
      const laborante = await this.prisma.laborante.create({
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
      return this.RegisterUserToDataBase(
        'laborante',
        dto.email,
        password,
        dto.fullName,
        user.userId,
        laborante.id,
        passwordGenerated,
      );
    }
  }
}
