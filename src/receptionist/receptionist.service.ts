/* eslint-disable */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { patient, payment, record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FilterPatients,
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
      try {
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
      } catch (error) {
        throw new BadRequestException('Server Error');
      }

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
    try {
      const patients = await this.prisma.patient.findMany({
        where: { clinicId: user.clinicId },
      });
      return patients;
    } catch (error) {
      throw new BadRequestException('Server Error');
    }
  }

  async filterPatients(dto: FilterPatients, user: User): Promise<patient[]> {
    if (dto.fullName) {
      try {
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
      } catch (error) {
        throw new BadRequestException('Server Error');
      }
    }
    if (dto.idNumber) {
      try {
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
      } catch (error) {
        throw new BadRequestException('Server Error');
      }
    }
  }

  //send to nurse for examination
  async CreateRecord(
    pId: number,
    user: User,
    dto: RecordDto,
    fullNames: string,
  ): Promise<{ message: string }> {
    let Dto = new RecordDto();
    Dto.amountToBePaid = 0;
    Dto.amountPaid = 0;
    Dto.unpaidAmount = 0;
    Dto.amountPaidByInsurance = 0;
    let priceToPay: number;
    let insurancePaid: number;
    try {
      const record = await this.prisma.records.create({
        data: {
          patientId: pId,
          clinicId: user.clinicId,
          fullNames,
          insurance: dto.insurance,
          doctor: dto.doctor,
          nurse: dto?.nurse,
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
      priceToPay =
        itemPrice.price - (itemPrice.price * parseInt(dto.rate)) / 100;
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
    } catch (error) {
      throw new BadRequestException('Data Server Error');
    }
  }

  //see records

  async seeRecords(): Promise<record_details[]> {
    const records = await this.prisma.record_details.findMany({
      where: { destination: ERecords.RECEPTONIST_DESTINATION },
    });
    return records;
  }

  async seeRecordPayment(recordId: number): Promise<payment[]> {
    try {
      const payments = await this.prisma.payment.findMany({
        where: {
          recordId,
        },
      });
      return payments;
    } catch (error) {
      throw new BadRequestException('Server down');
    }
  }

  async activateRecord(id: number): Promise<{ message: string }> {
    try {
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
      await this.prisma.record_details.create({
        data: {
          recordId: record.record_code,
          fullNames: record.fullNames,
          destination: ERecords.DOCTOR_DESTINATION,
          status: EStatus.UNREAD,
          doctor: record.doctor,
        },
      });

      return { message: 'Record activated' };
    } catch (error) {
      throw new BadRequestException('Server Error');
    }
  }

  async makePayment(
    id: number,
    dto: MakePaymentDto,
  ): Promise<{ message: string }> {
    try {
      let message: string;
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
        message = 'Payment made successfully';
      });
      if (message) return { message };
    } catch (error) {}
  }
}
