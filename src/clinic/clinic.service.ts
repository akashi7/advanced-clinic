/* eslint-disable */
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  consultation,
  doctor,
  examList,
  insurance,
  laborante,
  nurse,
  receptionist,
  User,
} from '@prisma/client';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  consultationDto,
  ExamDto,
  InsuranceDto,
  insuranceUpdateDto,
  PriceListDto,
  registerEmployee,
  UpdatePasswordDto,
  UpdatePriceListDto,
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
    const isUser = await this.prisma.user.findFirst({
      where: { email },
    });
    if (isUser) throw new ConflictException('User Email already registered');
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
    try {
      await this.mail.sendMail(
        `${User.email}`,
        `${User.fullName} credentials`,
        '"No Reply" <noreply@kuranga.com>',
        `${passwordGenerated}`,
      );
      return User;
    } catch (error) {
      console.log('Error', error);
      if (role === ERoles.RECEPTIONIST) {
        await this.prisma.receptionist.delete({
          where: { id: userId },
        });
        await this.prisma.user.delete({
          where: { id: User.id },
        });
        throw new BadRequestException('Email not sent');
      }
      if (role === ERoles.DOCTOR) {
        await this.prisma.doctor.delete({
          where: { id: userId },
        });
        await this.prisma.user.delete({
          where: { id: User.id },
        });
        throw new BadRequestException('Email not sent');
      }
      if (role === ERoles.NURSE) {
        await this.prisma.nurse.delete({
          where: { id: userId },
        });
        await this.prisma.user.delete({
          where: { id: User.id },
        });
        throw new BadRequestException('Email not sent');
      }
      if (role === ERoles.LABORANTE) {
        await this.prisma.laborante.delete({
          where: { id: userId },
        });
        await this.prisma.user.delete({
          where: { id: User.id },
        });
        throw new BadRequestException('Email not sent');
      }
    }
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
        where: { AND: [{ clinicId: user.clinicId }, { email: dto.email }] },
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
        where: { AND: [{ clinicId: user.clinicId }, { email: dto.email }] },
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
        where: { AND: [{ clinicId: user.clinicId }, { email: dto.email }] },
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
        where: { AND: [{ clinicId: user.clinicId }, { email: dto.email }] },
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

  async getAllUsers(user: User): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        clinicId: user.clinicId,
      },
    });
    users.map((user) => {
      delete user.password;
    });
    users.shift();
    return users;
  }

  async getOneUser(
    id: number,
    role: string,
  ): Promise<receptionist | doctor | nurse | laborante> {
    if (role === ERoles.RECEPTIONIST) {
      const user = await this.prisma.receptionist.findFirst({
        where: { id },
      });
      return user;
    }
    if (role === ERoles.DOCTOR) {
      const user = await this.prisma.doctor.findFirst({
        where: { id },
      });
      return user;
    }
    if (role === ERoles.NURSE) {
      const user = await this.prisma.nurse.findFirst({
        where: { id },
      });
      return user;
    }
    if (role === ERoles.LABORANTE) {
      const user = await this.prisma.laborante.findFirst({
        where: { id },
      });
      return user;
    }
  }

  async registerInsurance(dto: InsuranceDto, user: User) {
    const isInsurance = await this.prisma.insurance.findFirst({
      where: { AND: [{ clinicId: user.clinicId }, { name: dto.name }] },
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

  async getAllInsurance(user: User): Promise<insurance[]> {
    const insurance = await this.prisma.insurance.findMany({
      where: { clinicId: user.userId },
    });
    return insurance;
  }

  async deleteInsurance(id: number): Promise<{ message: string }> {
    await this.prisma.insurance.delete({
      where: { id },
    });
    return {
      message: 'Insurance deleted',
    };
  }

  async registerConsultation(
    dto: consultationDto,
    user: User,
  ): Promise<{ message: string }> {
    const isConsultation = await this.prisma.consultation.findFirst({
      where: { AND: [{ clinicId: user.userId }, { type: dto.type }] },
    });
    if (isConsultation)
      throw new ConflictException('Consultation already registered');
    await this.prisma.consultation.create({
      data: {
        type: dto.type,
        description: dto.description,
        clinicId: user.userId,
        consultation: dto.consultation,
      },
    });
    return {
      message: 'Consultation registered',
    };
  }

  async updateConsultation(
    dto: consultationDto,
    id: number,
  ): Promise<{ message: string }> {
    const isConsultation = await this.prisma.consultation.findFirst({
      where: { id },
    });

    let type: any, description: any, consultation: any;

    dto.type ? (type = dto.type) : (type = isConsultation.type);
    dto.description
      ? (description = dto.description)
      : (description = isConsultation.description);
    dto.consultation
      ? (consultation = dto.consultation)
      : (consultation = isConsultation.consultation);

    await this.prisma.consultation.update({
      where: { id },
      data: {
        type,
        description,
        consultation,
      },
    });
    return {
      message: 'Consultation updated',
    };
  }

  async deleteConsultation(id: number): Promise<{ message: string }> {
    await this.prisma.consultation.delete({
      where: { id },
    });
    return {
      message: 'Consultation deleted',
    };
  }

  async getAllConsultation(user: User): Promise<consultation[]> {
    const consultation = await this.prisma.consultation.findMany({
      where: { clinicId: user.userId },
    });
    return consultation;
  }

  async registerExams(dto: ExamDto, user: User): Promise<{ message: string }> {
    const isExam = await this.prisma.examList.findFirst({
      where: { AND: [{ clinicId: user.userId }, { Code: dto.Code }] },
    });
    if (isExam) throw new ConflictException('Exam already registered');
    await this.prisma.examList.create({
      data: {
        Name: dto.Name,
        description: dto.description,
        Code: dto.Code,
        clinicId: user.userId,
      },
    });
    return {
      message: 'Exam registered',
    };
  }

  async updateExam(dto: ExamDto, id: number): Promise<{ message: string }> {
    const isExam = await this.prisma.examList.findFirst({
      where: { id },
    });

    let Name: any, description: any, Code: any;

    dto.Name ? (Name = dto.Name) : (Name = isExam.Name);
    dto.description
      ? (description = dto.description)
      : (description = isExam.description);
    dto.Code ? (Code = dto.Code) : (Code = isExam.Code);

    await this.prisma.examList.update({
      where: { id },
      data: {
        Name,
        description,
        Code,
      },
    });
    return {
      message: 'Exam updated',
    };
  }

  async deleteExams(id: number): Promise<{ message: string }> {
    await this.prisma.examList.delete({
      where: { id },
    });
    return {
      message: 'Exam deleted',
    };
  }

  async getAllExams(user: User): Promise<examList[]> {
    const exam = await this.prisma.examList.findMany({
      where: { clinicId: user.userId },
    });
    return exam;
  }

  async createPriceList(
    dto: PriceListDto,
    user: User,
  ): Promise<{ message: string }> {
    let type: string;
    if (dto.type !== 'consultation' && dto.type !== 'exam') {
      throw new BadRequestException('Invalid type');
    }
    if (dto.type === 'consultation') {
      const isConsultation = await this.prisma.consultation.findFirst({
        where: { id: dto.itemId },
      });
      if (!isConsultation)
        throw new BadRequestException('Consultation not registered');
      else type = 'consultation';
    }
    if (dto.type === 'exam') {
      const isExam = await this.prisma.examList.findFirst({
        where: { id: dto.itemId },
      });
      if (!isExam) throw new BadRequestException('Exam not registered');
      else type = 'exam';
    }

    const isPriceList = await this.prisma.priceList.findFirst({
      where: {
        AND: [
          { clinicId: user.userId },
          { itemId: dto.itemId },
          { insuranceId: dto.insuranceId },
        ],
      },
    });

    if (isPriceList)
      throw new ConflictException('Price list already registered');

    await this.prisma.priceList.create({
      data: {
        itemId: dto.itemId,
        price: dto.price,
        clinicId: user.userId,
        insuranceId: dto.insuranceId,
        Type: type,
      },
    });
    return {
      message: 'PriceList created',
    };
  }
  async updatePriceList(
    dto: UpdatePriceListDto,
    id: number,
  ): Promise<{ message: string }> {
    await this.prisma.priceList.update({
      where: { id },
      data: {
        price: dto.price,
      },
    });
    return {
      message: 'PriceList updated',
    };
  }
  async deletePriceList(id: number): Promise<{ message: string }> {
    await this.prisma.priceList.delete({
      where: { id },
    });
    return {
      message: 'PriceList deleted',
    };
  }

  async getConsultationPriceList(user: User): Promise<unknown> {
    const prices = await this.prisma
      .$queryRaw`SELECT * FROM "priceList" LEFT JOIN "consultation" ON "priceList"."itemId" = "consultation"."id"  LEFT JOIN "insurance" ON "priceList"."insuranceId"="insurance"."id"  WHERE "priceList"."clinicId" = ${user.userId} AND "priceList"."Type" = 'consultation'`;
    return prices;
  }

  async getExamPriceList(user: User): Promise<unknown> {
    const prices = await this.prisma
      .$queryRaw`SELECT * FROM "priceList"  LEFT JOIN "examList" ON "priceList"."itemId" = "examList"."id" LEFT JOIN "insurance" ON "priceList"."insuranceId"="insurance"."id"  WHERE "priceList"."clinicId" = ${user.userId} AND "priceList"."Type" = 'exam'`;
    return prices;
  }
}
