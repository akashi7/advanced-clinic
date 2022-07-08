import { Injectable } from '@nestjs/common';
import { records, record_details } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { examDto } from './dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async docSeeAllRequets(): Promise<record_details[]> {
    const record = await this.prisma.record_details.findMany({
      where: {
        destination: ERecords.DOCTOR_DESTINATION,
      },
    });
    return record;
  }

  async docViewRequet(id: number): Promise<{ data: records }> {
    const record_details = await this.prisma.record_details.findFirst({
      where: {
        id,
      },
    });
    const record = await this.prisma.records.findFirst({
      where: {
        record_code: record_details.recordId,
      },
    });

    await this.prisma.record_details.update({
      where: {
        id,
      },
      data: {
        status: EStatus.READ,
      },
    });

    return {
      data: record,
    };
  }

  async docSendToLabo(
    id: number,
    fullNames: string,
    dto: examDto,
  ): Promise<{ message: string }> {
    const exam = dto.exams.split(',');
    console.log({ exam });
    const record = await this.prisma.record_details.findFirst({
      where: {
        id,
      },
    });
    await this.prisma.record_details.create({
      data: {
        recordId: record.recordId,
        destination: ERecords.LABORANTE_DESTINATION,
        status: EStatus.UNREAD,
        fullNames,
      },
    });

    await this.prisma.exam.create({
      data: {
        record_code: record.recordId,
        exam,
      },
    });
    return {
      message: 'Record sent',
    };
  }
}
