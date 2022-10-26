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
  patient,
  receptionist,
  stock,
  User,
} from '@prisma/client';
import * as argon from 'argon2';
import { endOfDay, getMonth, getYear, startOfDay } from 'date-fns';
import { ECategory, ERoles, EStatus } from 'src/auth/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AsignRoleDto,
  consultationDto,
  createStockDto,
  ExamDto,
  filterclinicReports,
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

  async deleteUser(role: string, user: User, userId: number): Promise<void> {
    await this.prisma[`${role}`]['delete']({
      where: { id: userId },
    });
    await this.prisma.user.delete({
      where: { id: user.id },
    });
  }

  async RegisterUserToDataBase(
    role: string,
    email: string,
    password: string,
    fullName: string,
    clinicId: number,
    userId: number,
    passwordGenerated: string,
    assignedRoles: string[] | [],
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
        asignedRole: assignedRoles.length === 0 ? [] : assignedRoles,
      },
    });
    delete User.password;
    try {
      await this.mail.sendMail(
        `${User.email}`,
        `${User.fullName} credentials`,
        '"No Reply" <noreply@kuranga.com>',
        `
        Dear ${User.fullName} your password is as follow
        ${passwordGenerated}
        Please update your password once loggedIn
        `,
      );
      return User;
    } catch (error) {
      this.deleteUser(role, User, userId);
      throw new BadRequestException('Email not sent');
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
      : dto.role === 'cashier'
      ? (isRole = ERoles.CASHIER)
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
        dto.assignedRoles.length === 0 ? [] : dto.assignedRoles,
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
        dto.assignedRoles.length === 0 ? [] : dto.assignedRoles,
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
        dto.assignedRoles.length === 0 ? [] : dto.assignedRoles,
      );
    }

    if (isRole === ERoles.LABORANTE) {
      const isThereLabaorante = await this.prisma.laborante.findFirst({
        where: {
          AND: [
            {
              role: ERoles.LABORANTE,
            },
            { clinicId: user.userId },
          ],
        },
      });

      if (isThereLabaorante) {
        throw new ConflictException('Can not have more than 2 laborantes');
      } else {
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
          dto.assignedRoles.length === 0 ? [] : dto.assignedRoles,
        );
      }
    }
    if (isRole === ERoles.CASHIER) {
      const isCashier = await this.prisma.cashier.findFirst({
        where: { AND: [{ clinicId: user.clinicId }, { email: dto.email }] },
      });
      if (isCashier) throw new ConflictException('Cahier already registered');
      const passwordGenerated = this.makePassword(8);
      const password = await argon.hash(passwordGenerated);
      const cashier = await this.prisma.cashier.create({
        data: {
          email: dto.email,
          fullName: dto.fullName,
          phone: dto.phone,
          gender: dto.gender,
          role: ERoles.CASHIER,
          clinicId: user.userId,
        },
      });
      return this.RegisterUserToDataBase(
        ERoles.CASHIER,
        dto.email,
        password,
        dto.fullName,
        user.userId,
        cashier.id,
        passwordGenerated,
        dto.assignedRoles.length === 0 ? [] : dto.assignedRoles,
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
    // users.shift();
    return users;
  }

  async ViewUser(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    delete user.password;
    return user;
  }

  async getOneUser(
    id: number,
    role: string,
  ): Promise<receptionist | doctor | nurse | laborante> {
    const user = await this.prisma[`${role}`]['findFirst']({
      where: { id },
    });
    return user;
    // if (role === ERoles.RECEPTIONIST) {
    //   const user = await this.prisma.receptionist.findFirst({
    //     where: { id },
    //   });
    //   return user;
    // }
    // if (role === ERoles.DOCTOR) {
    //   const user = await this.prisma.doctor.findFirst({
    //     where: { id },
    //   });
    //   return user;
    // }
    // if (role === ERoles.NURSE) {
    //   const user = await this.prisma.nurse.findFirst({
    //     where: { id },
    //   });
    //   return user;
    // }
    // if (role === ERoles.LABORANTE) {
    //   const user = await this.prisma.laborante.findFirst({
    //     where: { id },
    //   });
    //   return user;
    // }
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
      where: { clinicId: user.clinicId },
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
      where: { clinicId: user.clinicId },
    });
    return exam;
  }

  async createPriceList(
    dto: PriceListDto,
    user: User,
  ): Promise<{ message: string }> {
    let type: string;
    if (
      dto.type !== 'consultation' &&
      dto.type !== 'exam' &&
      dto.type !== 'stock'
    ) {
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

    if (dto.type === 'stock') {
      const isExam = await this.prisma.stock.findFirst({
        where: { id: dto.itemId },
      });
      if (!isExam) throw new BadRequestException('Stock not registered');
      else type = 'stock';
    }

    const isPriceList = await this.prisma.priceList.findFirst({
      where: {
        AND: [
          { clinicId: user.userId },
          { itemId: dto.itemId },
          { insuranceId: dto.insuranceId },
          { Type: type },
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

  async getStockPriceList(user: User): Promise<unknown> {
    const prices = await this.prisma
      .$queryRaw`SELECT * FROM "priceList"  LEFT JOIN "stock" ON "priceList"."itemId" = "stock"."id" LEFT JOIN "insurance" ON "priceList"."insuranceId"="insurance"."id"  WHERE "priceList"."clinicId" = ${user.userId} AND "priceList"."Type" = 'stock'`;
    return prices;
  }

  async ClinicReport(user: User): Promise<{
    totalUsers: number;
    totalPatients: number;
    totalChildren: number;
    totalAdults: number;
    totalRecords: number;
    totalActiveRecords: number;
    totalPendingrecords: number;
    totalClosedRecords: number;
    totalInvoices: number;
    totalPayments: number;
    totalPaymentsMade: number;
  }> {
    const allUsers = await this.prisma.user.count({
      where: { clinicId: user.clinicId },
    });
    const patients = await this.prisma.patient.count({
      where: { clinicId: user.clinicId },
    });
    const childrens = await this.prisma.patient.count({
      where: { AND: [{ clinicId: user.clinicId }, { isInfant: true }] },
    });
    const adutls = await this.prisma.patient.count({
      where: { AND: [{ clinicId: user.clinicId }, { isInfant: false }] },
    });
    const records = await this.prisma.records.count({
      where: { clinicId: user.clinicId },
    });
    const activeRecords = await this.prisma.records.count({
      where: { AND: [{ clinicId: user.clinicId }, { status: 'active' }] },
    });
    const pendingRecords = await this.prisma.records.count({
      where: {
        AND: [{ clinicId: user.clinicId }, { recordStatus: EStatus.PENDING }],
      },
    });
    const closedRecords = await this.prisma.records.count({
      where: {
        AND: [{ clinicId: user.clinicId }, { recordStatus: EStatus.FINISHED }],
      },
    });

    const invoices = await this.prisma.invoice.count({
      where: { clinicId: user.clinicId },
    });

    const payment = await this.prisma.payment.count({
      where: { clinicId: user.clinicId },
    });

    let amountReceveid: any;

    const query: any[] = await this.prisma
      .$queryRaw`SELECT SUM("amount") AS "amount" FROM "payment" WHERE "clinicId"=${user.clinicId} `;

    query.forEach((obj) => (amountReceveid = obj.amount));

    return {
      totalUsers: allUsers,
      totalPatients: patients,
      totalChildren: childrens,
      totalAdults: adutls,
      totalRecords: records,
      totalActiveRecords: activeRecords,
      totalPendingrecords: pendingRecords,
      totalClosedRecords: closedRecords,
      totalInvoices: invoices,
      totalPayments: payment,
      totalPaymentsMade: amountReceveid,
    };
  }

  async PaymentReport(user: User, month: number, year: number) {
    if (month && year) {
      const payments = await this.prisma.payment.findMany({
        where: { clinicId: user.clinicId },
      });

      let payment: any[];
      let consultations: any[];
      let exams: any[];

      let xkey = payments.map((obj) => obj.type);

      for (const obj of payments) {
        if (xkey.includes('consultation')) {
          consultations = await this.prisma
            .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId"="consultation"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${
            user.clinicId
          } AND (${getMonth(obj.createdAt)}=${month} AND ${getYear(
            obj.createdAt,
          )}=${year})`;
          let filteredC = consultations.map((obj) => {
            return {
              id: obj.id,
              createdAt: obj.createdAt,
              updatedAt: obj.updatedAt,
              amount: obj.amount,
              insurancePaid: obj.insurancePaid,
              insurance: obj.name,
              rate: obj.rate,
              name: obj.type,
              Type: 'consultation',
            };
          });
          payment = filteredC;
        }
        if (xkey.includes('exam')) {
          exams = await this.prisma
            .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId"="examList"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${
            user.clinicId
          } AND (${getMonth(obj.createdAt)}=${month} AND ${getYear(
            obj.createdAt,
          )}=${year})`;
          let filteredC = exams.map((obj) => {
            return {
              id: obj.id,
              createdAt: obj.createdAt,
              updatedAt: obj.updatedAt,
              amount: obj.amount,
              insurancePaid: obj.insurancePaid,
              insurance: obj.name,
              rate: obj.rate,
              name: obj.Name,
              Type: 'exam',
            };
          });
          payment = filteredC;
        }
        if (xkey.includes('exam') && xkey.includes('consultation')) {
          consultations = await this.prisma
            .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId"="consultation"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${
            user.clinicId
          } AND (${getMonth(obj.createdAt)}=${month} AND ${getYear(
            obj.createdAt,
          )}=${year})`;
          exams = await this.prisma
            .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId"="examList"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${
            user.clinicId
          } AND (${getMonth(obj.createdAt)}=${month} AND ${getYear(
            obj.createdAt,
          )}=${year})`;

          let E = exams.map((obj) => {
            return {
              id: obj.id,
              createdAt: obj.createdAt,
              updatedAt: obj.updatedAt,
              amount: obj.amount,
              insurancePaid: obj.insurancePaid,
              insurance: obj.name,
              rate: obj.rate,
              name: obj.Name,
              Type: 'exam',
            };
          });
          let C = consultations.map((obj) => {
            return {
              id: obj.id,
              createdAt: obj.createdAt,
              updatedAt: obj.updatedAt,
              amount: obj.amount,
              insurancePaid: obj.insurancePaid,
              insurance: obj.name,
              rate: obj.rate,
              name: obj.type,
              Type: 'consultation',
            };
          });
          payment = [...C, ...E];
        }
      }
      return payment;
    } else {
      const payments = await this.prisma.payment.findMany({
        where: { clinicId: user.clinicId },
      });

      let payment: any[];
      let consultations: any[];
      let exams: any[];

      let xkey = payments.map((obj) => {
        return obj.type;
      });
      if (xkey.includes('consultation')) {
        consultations = await this.prisma
          .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId"="consultation"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${user.clinicId}`;
        let filteredC = consultations.map((obj) => {
          return {
            id: obj.id,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            amount: obj.amount,
            insurancePaid: obj.insurancePaid,
            insurance: obj.name,
            rate: obj.rate,
            name: obj.type,
            Type: 'consultation',
          };
        });
        payment = filteredC;
      }
      if (xkey.includes('exam')) {
        exams = await this.prisma
          .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId"="examList"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${user.clinicId}`;
        let filteredC = exams.map((obj) => {
          return {
            id: obj.id,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            amount: obj.amount,
            insurancePaid: obj.insurancePaid,
            insurance: obj.name,
            rate: obj.rate,
            name: obj.Name,
            Type: 'exam',
          };
        });
        payment = filteredC;
      }
      if (xkey.includes('exam') && xkey.includes('consultation')) {
        consultations = await this.prisma
          .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId"="consultation"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${user.clinicId}`;
        exams = await this.prisma
          .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId"="examList"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."clinicId"=${user.clinicId}`;

        let E = exams.map((obj) => {
          return {
            id: obj.id,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            amount: obj.amount,
            insurancePaid: obj.insurancePaid,
            insurance: obj.name,
            rate: obj.rate,
            name: obj.Name,
            Type: 'exam',
          };
        });
        let C = consultations.map((obj) => {
          return {
            id: obj.id,
            createdAt: obj.createdAt,
            updatedAt: obj.updatedAt,
            amount: obj.amount,
            insurancePaid: obj.insurancePaid,
            insurance: obj.name,
            rate: obj.rate,
            name: obj.type,
            Type: 'consultation',
          };
        });
        payment = [...C, ...E];
      }
      return payment;
    }
  }

  async asignRolesToUsers(id: number, dto: AsignRoleDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    const asignedRoles = await this.prisma.user.update({
      where: { id },
      data: {
        asignedRole: [...user.asignedRole, ...dto.roles],
      },
    });

    if (asignedRoles) return { message: 'Asigned Roles' };
  }

  async removeRoles(id: number, dto: AsignRoleDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    let newRole: string[] = user.asignedRole;
    dto.roles.forEach((role) => {
      let index = newRole.indexOf(role);
      if (index !== -1) {
        newRole.splice(index, 1);
      }
    });
    const updatedRoles = await this.prisma.user.update({
      where: { id },
      data: {
        asignedRole: newRole,
      },
    });
    if (updatedRoles) return { message: 'Roles updated' };
  }

  async createStock(dto: createStockDto, user: User): Promise<stock> {
    const obj: any = new createStockDto();
    obj.expirationDate = new Date(dto.expirationDate);
    obj.item = dto.item;
    obj.quantity = dto.quantity;
    obj.category =
      dto.category.trim() === 'medicalEquipment'
        ? ECategory.MEDICAL_EQUIPMENT
        : ECategory.MEDECINES;

    const isMedecine = await this.prisma.stock.findFirst({
      where: {
        AND: [
          { clinicId: user.clinicId },
          {
            item: {
              contains: dto.item,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    if (isMedecine)
      throw new ConflictException('Medcine name arleady registered');
    const medecine = await this.prisma.stock.create({
      data: {
        ...obj,
        clinicId: user.clinicId,
      },
    });
    return medecine;
  }

  async allStock(user: User): Promise<stock[]> {
    const allStock = await this.prisma.stock.findMany({
      where: {
        clinicId: user.clinicId,
      },
    });
    return allStock;
  }

  async viewOneStock(id: number): Promise<stock> {
    const item = await this.prisma.stock.findFirst({
      where: {
        id,
      },
    });
    return item;
  }

  async updateStock(id: number, dto: createStockDto): Promise<string> {
    const obj: any = new createStockDto();
    obj.expirationDate = new Date(dto.expirationDate);
    obj.item = dto.item;
    obj.quantity = dto.quantity;
    obj.category = dto.category;
    const updated = await this.prisma.stock.update({
      where: {
        id,
      },
      data: {
        ...obj,
      },
    });
    if (updated) return 'stock item updated';
  }

  async deleteStock(id: number) {
    const deleted = await this.prisma.stock.delete({
      where: {
        id,
      },
    });
    if (deleted) return 'stock item deleted';
  }

  async clinicViewReport(user: User, dto: filterclinicReports) {
    const clinic = await this.prisma.clinic.findFirst({
      where: { id: user.clinicId },
    });

    if (dto.case) {
      const report = await this.prisma.records.count({
        where: {
          AND: [
            { newCase: dto.case },
            { clinicId: user.clinicId },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });
      return report;
    }
    if (dto.disease) {
      const report = await this.prisma.records.count({
        where: {
          clinicId: user.clinicId,
          AND: [
            { newCase: dto.case },
            { clinicId: user.clinicId },
            { disease: { has: dto.disease } },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });
      return report;
    } else if (dto.case && dto.age) {
      let newReport = [];
      let patients: patient[];
      const report = await this.prisma.records.findMany({
        where: {
          AND: [
            { newCase: dto.case },
            { clinicId: user.clinicId },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });
      dto.age <= 5
        ? (patients = await this.prisma.patient.findMany({
            where: {
              AND: [{ age: { lte: dto.age } }, { clinicId: user.clinicId }],
            },
          }))
        : (patients = await this.prisma.patient.findMany({
            where: {
              AND: [{ age: { gt: dto.age } }, { clinicId: user.clinicId }],
            },
          }));

      const allPa = patients.map((pat) => {
        return {
          p_id: pat.id,
        };
      });
      const allRec = report.map((item) => {
        return {
          p_id: item.patientId,
        };
      });

      newReport = allRec.filter((el) => {
        return allPa.find((element) => {
          return element.p_id === el.p_id;
        });
      });

      return newReport.length;
    } else if (dto.disease && dto.age) {
      let newReport = [];
      let patients: patient[];
      const report = await this.prisma.records.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { disease: { has: dto.disease } },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });

      dto.age <= 5
        ? (patients = await this.prisma.patient.findMany({
            where: {
              AND: [{ age: { lte: dto.age } }, { clinicId: user.clinicId }],
            },
          }))
        : (patients = await this.prisma.patient.findMany({
            where: {
              AND: [{ age: { gt: dto.age } }, { clinicId: user.clinicId }],
            },
          }));

      const allPa = patients.map((pat) => {
        return {
          p_id: pat.id,
        };
      });

      const allRec = report.map((item) => {
        return {
          p_id: item.patientId,
        };
      });
      newReport = allRec.filter((el) => {
        return allPa.find((element) => {
          return element.p_id === el.p_id;
        });
      });
      return newReport.length;
    } else if (dto.case && dto.disease) {
      const report = await this.prisma.records.count({
        where: {
          AND: [
            { newCase: dto.case },
            { clinicId: user.clinicId },
            { disease: { has: dto.disease } },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });
      return report;
    } else if (dto.case && dto.disease && dto.age) {
      let newReport = [];
      let patients: patient[];
      const report = await this.prisma.records.findMany({
        where: {
          AND: [
            { newCase: dto.case },
            { clinicId: user.clinicId },
            { disease: { has: dto.disease } },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });

      dto.age <= 5
        ? (patients = await this.prisma.patient.findMany({
            where: {
              AND: [{ age: { lte: dto.age } }, { clinicId: user.clinicId }],
            },
          }))
        : (patients = await this.prisma.patient.findMany({
            where: {
              AND: [{ age: { gt: dto.age } }, { clinicId: user.clinicId }],
            },
          }));

      const allPa = patients.map((pat) => {
        return {
          p_id: pat.id,
        };
      });

      const allRec = report.map((item) => {
        return {
          p_id: item.patientId,
        };
      });

      newReport = allRec.filter((el) => {
        return allPa.find((element) => {
          return element.p_id === el.p_id;
        });
      });
      return newReport.length;
    }

    if (dto.horZone) {
      let newReport: patient[];
      const report = await this.prisma.records.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [{ clinicId: user.clinicId }],
        },
      });

      const allRec = report.map((item) => {
        return {
          p_id: item.patientId,
        };
      });

      newReport = patients.filter((el) => {
        return allRec.find((element) => {
          return element.p_id === el.id;
        });
      });

      let generated = newReport.filter((item) => {
        return item.sector !== clinic.sector;
      });

      let sectors = {};

      generated.forEach((item) => {
        if (sectors[item.sector]) {
          sectors[item.sector] += 1;
        } else {
          sectors[item.sector] = 1;
        }
      });

      return {
        horsZonePatients: generated.length,
        status: sectors,
      };
    } else if (dto.horZone && dto.case) {
      let newReport: patient[];
      const report = await this.prisma.records.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { newCase: dto.case },
            { createdAt: { gte: startOfDay(new Date(dto.startDate)) } },
            { createdAt: { lte: endOfDay(new Date(dto.endDate)) } },
          ],
        },
      });
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [{ clinicId: user.clinicId }],
        },
      });

      const allRec = report.map((item) => {
        return {
          p_id: item.patientId,
        };
      });

      newReport = patients.filter((el) => {
        return allRec.find((element) => {
          return element.p_id === el.id;
        });
      });

      let generated = newReport.filter((item) => {
        return item.sector !== clinic.sector;
      });

      let sectors = {};

      generated.forEach((item) => {
        if (sectors[item.sector]) {
          sectors[item.sector] += 1;
        } else {
          sectors[item.sector] = 1;
        }
      });

      return {
        horsZonePatients: generated.length,
        status: sectors,
      };
    }
  }
}
