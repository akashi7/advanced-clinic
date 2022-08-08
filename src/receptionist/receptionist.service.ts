/* eslint-disable */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  invoice,
  invoice_details,
  patient,
  payment,
  records,
  User,
} from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FilterPatients,
  FilterRecordDto,
  MakePaymentDto,
  RecordDto,
  registerPatientDto,
} from './dto';

@Injectable()
export class ReceptionistService {
  constructor(private readonly prisma: PrismaService) {}

  //register patient
  async RegisterPatient(dto: registerPatientDto, user: User): Promise<patient> {
    if (dto.isInfant && dto.isInfant === true) {
      const isInfants = await this.prisma.patient.findFirst({
        where: {
          AND: [
            {
              clinicId: user.clinicId,
            },
            {
              isInfant: true,
            },
            {
              fullName: dto.fullName,
            },
          ],
          OR: [
            { FatherIdnumber: dto?.FatherIdNumber },
            { MotherIdnumber: dto?.MotherIdnumber },
            { GuardianIdNumber: dto?.GuardianIdNumber },
          ],
        },
      });
      if (isInfants) throw new ConflictException('Infant already exists');
      const Infant = await this.prisma.patient.create({
        data: {
          fullName: dto.fullName,
          DOB: dto.DOB,
          phone: dto.phone,
          gender: dto.gender,
          sector: dto.sector,
          village: dto.village,
          province: dto.province,
          district: dto.district,
          clinicId: user.clinicId,
          GuardianNames: dto.GuardianNames,
          GuardianPhone: dto.GuardianPhone,
          GuardianIdNumber: dto.GuardianIdNumber,
          isInfant: dto.isInfant,
          FatherName: dto.FatherName,
          MotherName: dto.MotherName,
          FatherIdnumber: dto.FatherIdNumber,
          MotherIdnumber: dto.MotherIdnumber,
          FatherPhone: dto.FatherPhone,
          MotherPhone: dto.MotherPhone,
        },
      });
      return Infant;

      // const enfant = await this.prisma
      //   .$queryRaw`SELECT * FROM "patient" WHERE "clinicId" = ${user.clinicId} AND "isInfant" = true  AND("FatherIdnumber" = ${dto?.FatherIdNumber} OR "MotherIdnumber" = ${dto?.MotherIdnumber} OR "GuardianIdNumber" = ${dto?.GuardianIdNumber})`;
      // console.log({ enfant });
    }

    try {
      const isPatient = await this.prisma.patient.findFirst({
        where: {
          AND: [{ clinicId: user.clinicId }, { idNumber: dto.idNumber }],
        },
      });
      if (isPatient)
        throw new ConflictException(
          `Patient is arleady registered by the names of ${isPatient.fullName}`,
        );
      const patient = await this.prisma.patient.create({
        data: {
          fullName: dto.fullName,
          DOB: dto.DOB,
          phone: dto.phone,
          gender: dto.gender,
          sector: dto.sector,
          village: dto.village,
          province: dto.province,
          district: dto.district,
          email: dto.email,
          marital_status: dto.marital_status,
          clinicId: user.clinicId,
          idNumber: dto.idNumber,
        },
      });
      return patient;
    } catch (error) {
      throw new BadRequestException('Server Error');
    }
  }

  //see all patients
  async getAllPatients(user: User): Promise<patient[]> {
    const patients = await this.prisma.patient.findMany({
      where: { clinicId: user.clinicId },
    });
    return patients;
  }

  async filterPatients(dto: FilterPatients, user: User): Promise<patient[]> {
    if (dto.fullName) {
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            {
              fullName: {
                mode: 'insensitive',
                contains: dto.fullName,
              },
            },
          ],
        },
      });
      return patients;
    }
    if (dto.idNumber) {
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [{ clinicId: user.clinicId }],
          OR: [
            { idNumber: dto.idNumber },
            { FatherIdnumber: dto.idNumber },
            { MotherIdnumber: dto.idNumber },
            { GuardianIdNumber: dto.idNumber },
          ],
        },
      });
      return patients;
    }
  }

  //send to nurse for examination
  async CreateRecord(
    pId: number,
    user: User,
    dto: RecordDto,
  ): Promise<{ message: string }> {
    let Dto = new RecordDto();
    Dto.amountToBePaid = 0;
    Dto.amountPaid = 0;
    Dto.unpaidAmount = 0;
    Dto.amountPaidByInsurance = 0;
    let priceToPay: number;
    let insurancePaid: number;
    let nurse: string;

    const insurance = await this.prisma.insurance.findFirst({
      where: { AND: [{ clinicId: user.clinicId }, { id: dto.insuranceId }] },
    });

    const doctor = await this.prisma.user.findFirst({
      where: { id: dto.doctor },
    });

    const patient = await this.prisma.patient.findFirst({
      where: { id: pId },
    });

    if (dto.nurse) {
      const Nurse = await this.prisma.user.findFirst({
        where: { id: dto.nurse },
      });
      nurse = Nurse.fullName;
    }
    if (!dto.nurse) {
      nurse = '';
    }

    const record = await this.prisma.records.create({
      data: {
        patientId: pId,
        clinicId: user.clinicId,
        fullNames: patient.fullName,
        insurance: insurance.name,
        doctor: doctor.fullName,
        nurse,
      },
    });
    const invoice = await this.prisma.invoice.create({
      data: {
        patientId: pId,
        recordId: record.record_code,
        rating: dto.rate,
        insuranceId: dto.insuranceId,
        clinicId: user.clinicId,
        amountPaid: Dto.amountPaid,
        amountToBePaid: Dto.amountToBePaid,
        unpaidAmount: Dto.unpaidAmount,
        amountPaidByInsurance: Dto.amountPaidByInsurance,
      },
    });
    const itemPrice = await this.prisma.priceList.findFirst({
      where: {
        AND: [
          { clinicId: user.clinicId },
          { Type: 'consultation' },
          { itemId: dto.itemId },
          { insuranceId: dto.insuranceId },
        ],
      },
    });
    priceToPay = itemPrice.price - (itemPrice.price * parseInt(dto.rate)) / 100;
    insurancePaid = (itemPrice.price * parseInt(dto.rate)) / 100;

    await this.prisma.invoice_details.create({
      data: {
        invoiceId: invoice.id,
        itemId: dto.itemId,
        type: 'consultation',
        price: itemPrice.price,
        priceToPay,
        insurancePaid,
      },
    });

    await this.prisma.invoice.update({
      data: {
        amountPaid: 0,
        amountPaidByInsurance: insurancePaid,
        amountToBePaid: priceToPay,
        unpaidAmount: priceToPay,
      },
      where: {
        id: invoice.id,
      },
    });

    return { message: 'Record created successfully' };
  }

  //see records

  async seeRecords(dto: FilterRecordDto, user: User): Promise<records[]> {
    let today = new Date();
    if (dto.recordDate) {
      today = new Date(dto.recordDate);
      const records = await this.prisma.records.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { createdAt: { gte: startOfDay(today) } },
            { createdAt: { lte: endOfDay(today) } },
          ],
        },
      });
      return records;
    }
    const records = await this.prisma.records.findMany({
      where: {
        AND: [
          { clinicId: user.clinicId },
          { createdAt: { gte: startOfDay(today) } },
          { createdAt: { lte: endOfDay(today) } },
        ],
      },
    });
    return records;
  }

  async seeRecordPayment(recordId: number): Promise<payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        recordId,
      },
    });
    return payments;
  }

  async viewOneRecordPayment(
    paymentId: number,
    type: string,
  ): Promise<unknown> {
    if (type === 'consultation') {
      const payment = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId" = "consultation"."id" WHERE "payment"."id" = ${paymentId}`;
      return payment;
    }
    if (type === 'exam') {
      const payment = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "exam" ON "payment"."itemId" = "exam"."id" WHERE "payment"."id" = ${paymentId}`;
      return payment;
    }
  }

  async activateRecord(id: number): Promise<{ message: string }> {
    const record = await this.prisma.records.findFirst({
      where: { record_code: id },
    });
    if (!record) throw new NotFoundException('Record not found');
    await this.prisma.records.update({
      where: { record_code: id },
      data: { status: EStatus.ACTIVE },
    });
    if (record.nurse) {
      await this.prisma.record_details.create({
        data: {
          recordId: record.record_code,
          fullNames: record.fullNames,
          destination: ERecords.NURSE_DESTINATION,
          status: EStatus.UNREAD,
          nurse: record.nurse,
        },
      });
    }
    if (!record.nurse) {
      await this.prisma.record_details.create({
        data: {
          recordId: record.record_code,
          fullNames: record.fullNames,
          destination: ERecords.DOCTOR_DESTINATION,
          status: EStatus.UNREAD,
          doctor: record.doctor,
        },
      });
    }

    return { message: 'Record activated' };
  }

  async makePayment(
    id: number,
    dto: MakePaymentDto,
  ): Promise<{ message: string }> {
    let message: string;
    let unpaidAmount: number;
    let amountPaid: number;
    const record = await this.prisma.records.findFirst({
      where: { record_code: id },
    });
    const invoice = await this.prisma.invoice.findFirst({
      where: { recordId: record.record_code },
    });
    dto.cart.forEach(async (item) => {
      await this.prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: item.priceToPay,
          itemId: item.itemId,
          type: item.type,
          recordId: record.record_code,
          insurancePaid: invoice.amountPaidByInsurance,
        },
      });
      unpaidAmount = invoice.unpaidAmount - item.priceToPay;
      amountPaid = invoice.amountPaid + item.priceToPay;
      await this.prisma.invoice.update({
        data: {
          unpaidAmount,
          amountPaid,
        },
        where: {
          id: invoice.id,
        },
      });
      await this.prisma
        .$queryRaw`UPDATE "invoice_details" SET "hasPaid" = true WHERE "invoiceId" = ${invoice.id} AND "itemId" = ${item.itemId}`;

      message = 'Payment made successfully';
    });
    if (message) return { message };
  }

  async viewInvoiceOfRecord(recordId: number): Promise<invoice> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        recordId,
      },
      include: {
        invoice_details: true,
      },
    });
    return invoice;
  }

  async viewInvoiceDetails(invoiceId: number): Promise<invoice_details[]> {
    const invoiceDetails = await this.prisma.invoice_details.findMany({
      where: { invoiceId },
    });
    return invoiceDetails;
  }
}
