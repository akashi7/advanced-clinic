/* eslint-disable */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { itemList, User } from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  InsuranceDto,
  insuranceUpdateDto,
  ItemDto,
  itemUpdateDto,
  registerEmployee,
  UpdatePasswordDto,
} from './dto/clinic.dto';

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
          phone: dto.phone,
          role: ERoles.RECEPTIONIST,
          clinicId: user.userId,
          gender: dto.gender,
        },
      });
      return this.RegisterUserToDataBase(
        ERoles.RECEPTIONIST,
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
          phone: dto.phone,
          gender: dto.gender,
          role: ERoles.DOCTOR,
          clinicId: user.userId,
        },
      });

      return this.RegisterUserToDataBase(
        ERoles.DOCTOR,
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
          phone: dto.phone,
          gender: dto.gender,
          role: ERoles.NURSE,
          clinicId: user.userId,
        },
      });
      return this.RegisterUserToDataBase(
        ERoles.NURSE,
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
          phone: dto.phone,
          gender: dto.gender,
          role: ERoles.LABORANTE,
          clinicId: user.userId,
        },
      });
      return this.RegisterUserToDataBase(
        ERoles.LABORANTE,
        dto.email,
        password,
        dto.fullName,
        user.userId,
        laborante.id,
        passwordGenerated,
      );
    } else throw new ConflictException('Role not found');
  }

  //update password

  async updatePassword(
    dto: UpdatePasswordDto,
    user: User,
  ): Promise<{ message: string }> {
    const isuser = await this.prisma.user.findFirst({
      where: { userId: user.userId, AND: [{ clinicId: user.clinicId }] },
    });

    if (!isuser) throw new NotFoundException('User not found');
    if (dto.newPassword !== dto.confirmPassword)
      throw new ConflictException('Passwords do not match');
    const isPassword = await argon.verify(isuser.password, dto.oldPassword);
    if (!isPassword) throw new ForbiddenException('Wrong password');
    const password = await argon.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.userId },
      data: {
        password,
      },
    });
    return { message: 'Password updated' };
  }

  async registerInsurance(dto: InsuranceDto, user: User) {
    const isInsurance = await this.prisma.insurance.findFirst({
      where: { name: dto.name },
    });
    if (isInsurance)
      throw new ConflictException('Insurance already registered');
    const insurance = await this.prisma.insurance.create({
      data: {
        name: dto.name,
        rate: dto.rate,
        clinicId: user.userId,
      },
    });
    return insurance;
  }

  async registerClinicItems(dto: ItemDto, user: User): Promise<itemList> {
    const isItem = await this.prisma.itemList.findFirst({
      where: { itemName: dto.itemName },
    });
    if (isItem) throw new ConflictException('Item already registered');
    const item = await this.prisma.itemList.create({
      data: {
        itemName: dto.itemName,
        priceTag: dto.priceTag,
        clinicId: user.userId,
      },
    });
    return item;
  }

  async updateInsurance(
    id: number,
    dto: insuranceUpdateDto,
  ): Promise<{ message: string }> {
    await this.prisma.insurance.update({
      where: { id },
      data: {
        rate: dto.rate,
      },
    });
    return {
      message: 'Insurance updated',
    };
  }

  async deleteInsurance(id: number): Promise<{ message: string }> {
    await this.prisma.insurance.delete({
      where: { id },
    });
    return {
      message: 'Insurance deleted',
    };
  }

  async updateItem(dto: itemUpdateDto, id: number) {
    await this.prisma.itemList.update({
      where: { id },
      data: {
        priceTag: dto.priceTag,
      },
    });
    return {
      message: 'Item updated',
    };
  }

  async deleteItem(id: number): Promise<{ message: string }> {
    await this.prisma.itemList.delete({
      where: { id },
    });
    return {
      message: 'Item deleted',
    };
  }
}
