/* eslint-disable */
import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerEmployee } from './dto/clinic.dto';

@Injectable()
export class ClinicService {
  constructor(private readonly prisma: PrismaService) {}

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
    const password = await argon.hash(dto.password);
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
    return User;
  }
}
