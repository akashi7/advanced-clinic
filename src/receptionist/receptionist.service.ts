/* eslint-disable */
import { ConflictException, Injectable } from '@nestjs/common';
import { patient, record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecordDto, registerPatientDto, searchField } from './dto';

@Injectable()
export class ReceptionistService {
  constructor(private readonly prisma: PrismaService, mail: MailService) {}

  //register patient
  async registerPatient(dto: registerPatientDto, user: User): Promise<patient> {
    const contact = parseInt(dto.contact);
    const isPatient = await this.prisma.patient.findFirst({
      where: { contact: contact },
    });
    if (isPatient)
      throw new ConflictException(
        `Patient is arleady registered by the names of ${isPatient.fullName}`,
      );
    const patient = await this.prisma.patient.create({
      data: {
        fullName: dto.fullName,
        DOB: dto.DOB,
        email: dto.email,
        contact,
        province: dto.province,
        district: dto.district,
        gender: dto.gender,
        sector: dto.sector,
        village: dto.village,
        marital_status: dto.marital_status,
        closeFullName: dto.closeFullName,
        closePhone: dto.closePhone,
        clinicId: user.id,
        address: dto.address,
      },
    });
    return patient;
  }

  //see all patients
  async getAllPatients(user: User): Promise<patient[]> {
    const patients = await this.prisma.patient.findMany({
      where: { clinicId: user.id },
    });
    return patients;
  }

  //send to nurse
  async sendToNurse(
    pId: number,
    user: User,
    fullNames: string,
  ): Promise<{ message: string }> {
    let dto = new RecordDto();
    dto.consultation = 'consultation';
    dto.price = 500;

    const record = await this.prisma.records.create({
      data: {
        patientId: pId,
        consultation: dto.consultation,
        price: dto.price,
        clinicId: user.id,
        fullNames,
      },
    });

    await this.prisma.record_details.create({
      data: {
        recordId: record.record_code,
        consultation: record.consultation,
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

  async searchPatient(dto: searchField): Promise<{ data: patient }> {
    const field = parseInt(dto.field);
    const patient = await this.prisma.patient.findFirst({
      where: {
        OR: [
          {
            id: field,
          },
          {
            contact: field,
          },
        ],
      },
    });
    return {
      data: patient,
    };
  }
}
