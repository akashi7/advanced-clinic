import { BadRequestException, Injectable } from '@nestjs/common';
import { records, record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { examDto } from './dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async docSeeAllRequets(user: User): Promise<record_details[]> {
    try {
      const record = await this.prisma.record_details.findMany({
        where: {
          AND: [
            {
              destination: ERecords.DOCTOR_DESTINATION,
              doctor: user.fullName,
            },
          ],
        },
      });
      return record;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Server down');
    }
  }

  async docViewRequet(id: number): Promise<{ data: records }> {
    try {
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
    } catch (error) {
      throw new BadRequestException('Server down');
    }
  }

  async docSendToLabo(
    id: number,
    fullNames: string,
    dto: examDto,
  ): Promise<{ message: string }> {
    const exam = dto.exams.split(',');
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
