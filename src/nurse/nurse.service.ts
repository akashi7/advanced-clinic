import { BadRequestException, Injectable } from '@nestjs/common';
import { record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { vitalsDto } from './dto';

@Injectable()
export class NurseService {
  constructor(private readonly prisma: PrismaService) {}

  async nurseSeeAllRequets(user: User): Promise<record_details[]> {
    try {
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
    } catch (error) {
      throw new BadRequestException('Server down');
    }
  }

  async viewRequest(id: number): Promise<{ data: record_details }> {
    try {
      const record = await this.prisma.record_details.findFirst({
        where: {
          id,
        },
      });
      await this.prisma.record_details.update({
        data: {
          status: EStatus.READ,
        },
        where: {
          id: record.id,
        },
      });
      return {
        data: record,
      };
    } catch (error) {
      throw new BadRequestException('Server down');
    }
  }

  async nurseRegisterVitals(
    dto: vitalsDto,
    id: number,
    recordId: number,
  ): Promise<{ message: string }> {
    try {
      await this.prisma.sign_vital.create({
        data: {
          ...dto,
          patientId: id,
          recordId,
        },
      });
      return {
        message: 'Vitals registered',
      };
    } catch (error) {
      throw new BadRequestException('Server down');
    }
  }

  async nurseSendToDoc(
    recordId: number,
    fullNames: string,
  ): Promise<{ message: string }> {
    try {
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
          fullNames,
          doctor: record.doctor,
        },
      });
      return {
        message: 'Record sent',
      };
    } catch (error) {
      throw new BadRequestException('Server down');
    }
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
