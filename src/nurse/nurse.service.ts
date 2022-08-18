import { Injectable } from '@nestjs/common';
import { records, record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { vitalsDto } from './dto';

@Injectable()
export class NurseService {
  constructor(private readonly prisma: PrismaService) {}

  async nurseSeeAllRequets(user: User): Promise<record_details[]> {
    const record = await this.prisma.record_details.findMany({
      where: {
        AND: [
          {
            destination: ERecords.NURSE_DESTINATION,
            nurse: user.fullName,
          },
        ],
      },
    });
    return record;
  }

  async viewRequest(id: number): Promise<records> {
    const recordDetails = await this.prisma.record_details.findFirst({
      where: {
        id,
      },
    });
    await this.prisma.record_details.update({
      data: {
        status: EStatus.READ,
      },
      where: {
        id: recordDetails.id,
      },
    });

    const record = await this.prisma.records.findFirst({
      where: { record_code: recordDetails.recordId },
      include: {
        sign_vital: true,
      },
    });

    return record;
  }

  async nurseRegisterVitals(
    dto: vitalsDto,
    recordId: number,
  ): Promise<{ message: string }> {
    const record = await this.prisma.records.findFirst({
      where: { record_code: recordId },
    });
    await this.prisma.sign_vital.create({
      data: {
        ...dto,
        patientId: record.patientId,
        recordId,
      },
    });
    return {
      message: 'Vitals registered',
    };
  }

  async nurseSendToDoc(recordId: number): Promise<{ message: string }> {
    const record = await this.prisma.record_details.findFirst({
      where: {
        id: recordId,
      },
    });
    await this.prisma.record_details.create({
      data: {
        recordId: record.recordId,
        destination: ERecords.DOCTOR_DESTINATION,
        status: EStatus.UNREAD,
        fullNames: record.fullNames,
        doctor: record.doctor,
      },
    });
    return {
      message: 'Record sent',
    };
  }

  async updateSignVitals(
    id: number,
    dto: vitalsDto,
  ): Promise<{ message: string }> {
    await this.prisma.sign_vital.update({
      data: {
        ...dto,
      },
      where: { id },
    });
    return {
      message: 'Updated success',
    };
  }
}
