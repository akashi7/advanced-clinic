import { Injectable } from '@nestjs/common';
import { record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { conductExamDto } from './dto';

@Injectable()
export class LaboService {
  constructor(private readonly prisma: PrismaService) {}

  async laboSeeAllRequets(user: User): Promise<record_details[]> {
    const record = await this.prisma.record_details.findMany({
      where: {
        AND: [
          {
            destination: ERecords.LABORANTE_DESTINATION,
            laborante: user.fullName,
          },
        ],
      },
    });
    return record;
  }

  async laboViewRequet(id: number): Promise<unknown> {
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

    const exams = await this.prisma
      .$queryRaw`SELECT * FROM "exam" LEFT JOIN "examList" ON "exam"."exam" = "examList"."id" WHERE "exam"."record_code"=${record.record_code}`;

    return exams;
  }

  async markExams(dto: conductExamDto): Promise<{ message: string }> {
    let message: string;
    dto.exams.forEach(async (exam) => {
      await this.prisma.exam.update({
        where: {
          id: exam.examId,
        },
        data: {
          conducted: 'yes',
          observation: exam.observation,
        },
      });
      message = 'Exams conducted';
    });
    if (message) return { message };
  }

  async sendToDoctor(id: number) {
    const record = await this.prisma.records.findFirst({
      where: { record_code: id },
    });
    await this.prisma.record_details.create({
      data: {
        recordId: record.record_code,
        fullNames: record.fullNames,
        destination: ERecords.DOCTOR_DESTINATION,
        status: EStatus.UNREAD,
        examResults: ERecords.EXAM_RESULTS,
      },
    });
  }
}
