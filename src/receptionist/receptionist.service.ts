/* eslint-disable */
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { patient, record_details, User } from '@prisma/client';
import { ERecords } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterPatients, RecordDto, registerPatientDto } from './dto';

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
    try {
      await this.prisma.records.create({
        data: {
          patientId: pId,
          clinicId: user.clinicId,
          fullNames,
          insurance: dto.insurance,
          doctor: dto.doctor,
          nurse: dto?.nurse,
          amountPaid: Dto.amountPaid,
          amountToBePaid: Dto.amountToBePaid,
          unpaidAmount: Dto.unpaidAmount,
          amountPaidByInsurance: Dto.amountPaidByInsurance,
        },
      });
      return { message: 'Record created successfully' };
    } catch (error) {
      throw new BadRequestException('Data Server Error');
    }

    // const invoice = await this.prisma.invoice.create({
    //   data: {
    //     patientId: pId,
    //     recordId: record.record_code,
    //     totalAmount,
    //     rating: dto.rate,
    //     insuranceId: dto.insuranceId,
    //     clinicId: user.clinicId,
    //   },
    // });

    // await this.prisma.record_details.create({
    //   data: {
    //     recordId: record.record_code,
    //     destination: ERecords.NURSE_DESTINATION,
    //     status: EStatus.UNREAD,
    //     fullNames,
    //   },
    // });

    // const itemPrice = await this.prisma.priceList.findFirst({
    //   where: {
    //     AND: [
    //       { clinicId: user.clinicId },
    //       { Type: 'consultation' },
    //       { itemId: dto.itemId },
    //       { insuranceId: dto.insuranceId },
    //     ],
    //   },
    // });

    // await this.prisma.invoice_details.create({
    //   data: {
    //     invoiceId: invoice.id,
    //     itemId: dto.itemId,
    //     type: 'consultation',
    //     price: itemPrice.price,
    //     initialPrice: 0,
    //   },
    // });
  }

  //see records

  async seeRecords(): Promise<record_details[]> {
    const records = await this.prisma.record_details.findMany({
      where: { destination: ERecords.RECEPTONIST_DESTINATION },
    });
    return records;
  }

  //search patient

  // async searchPatient(dto: searchField): Promise<{ data: patient }> {
  //   const field = parseInt(dto.field);
  //   const patient = await this.prisma.patient.findFirst({
  //     where: {
  //       OR: [
  //         {
  //           id: field,
  //         },
  //         {
  //           contact: field,
  //         },
  //       ],
  //     },
  //   });
  //   return {
  //     data: patient,
  //   };
  // }
}
