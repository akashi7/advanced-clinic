/* eslint-disable */
import { ConflictException, Injectable } from '@nestjs/common';
import { patient, record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { registerPatientDto } from './dto';

@Injectable()
export class ReceptionistService {
  constructor(private readonly prisma: PrismaService, mail: MailService) {}

  //register patient
  async RegisterPatient(dto: registerPatientDto, user: User): Promise<patient> {
    let phone: number;
    dto.phone ? (phone = parseInt(dto.phone)) : (phone = 0);
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

      // const enfant = await this.prisma
      //   .$queryRaw`SELECT * FROM "patient" WHERE "clinicId" = ${user.clinicId} AND "isInfant" = true  AND("FatherIdnumber" = ${dto?.FatherIdNumber} OR "MotherIdnumber" = ${dto?.MotherIdnumber} OR "GuardianIdNumber" = ${dto?.GuardianIdNumber})`;
      // console.log({ enfant });
      if (isInfants) throw new ConflictException('Infant already exists');
      const Infant = await this.prisma.patient.create({
        data: {
          fullName: dto.fullName,
          DOB: dto.DOB,
          phone,
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
    }

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
        phone,
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
  }

  //see all patients
  async getAllPatients(user: User): Promise<patient[]> {
    const patients = await this.prisma.patient.findMany({
      where: { clinicId: user.clinicId },
    });
    return patients;
  }

  //send to nurse for examination
  async sendToNurse(
    pId: number,
    user: User,
    fullNames: string,
    insurance: string,
    insuranceCode: number,
  ): Promise<{ message: string }> {
    const record = await this.prisma.records.create({
      data: {
        patientId: pId,
        clinicId: user.clinicId,
        fullNames,
        insurance,
        insuranceCode,
      },
    });

    await this.prisma.record_details.create({
      data: {
        recordId: record.record_code,
        destination: ERecords.NURSE_DESTINATION,
        status: EStatus.UNREAD,
        fullNames,
      },
    });
    return {
      message: 'Record sent',
    };
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
