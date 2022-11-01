/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { conductExamDto } from './dto';
import { examListInterface } from './interface';

@Injectable()
export class LaboService {
  constructor(private readonly prisma: PrismaService) {}

  async laboSeeAllRequets(user: User): Promise<record_details[]> {
    const record = await this.prisma.record_details.findMany({
      where: {
        AND: [
          {
            destination: ERecords.LABORANTE_DESTINATION,
          },
          {
            laborante: user.fullName,
          },
        ],
      },
    });
    record.reverse();
    return record;
  }

  async laboViewRequet(id: number): Promise<examListInterface[]> {
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
    const exams: examListInterface[] = await this.prisma
      .$queryRaw`SELECT "exam"."id" AS "Id", "Code","Name","clinicId","conducted","description","exam","observation","record_code"   FROM "exam" LEFT JOIN "examList" ON "exam"."exam" = "examList"."id" WHERE "exam"."record_code"=${record.record_code}`;
    return exams.sort((a, b) => a.Id - b.Id);
  }

  async markExams(dto: conductExamDto): Promise<{ message: string }> {
    let message: string;
    const conducted = 'yes';

    dto.exams.forEach(async (exam) => {
      await this.prisma.exam.update({
        data: {
          conducted,
          observation: exam.observation,
        },
        where: {
          id: exam.examId,
        },
      });
      // await this.prisma
      //   .$queryRaw`UPDATE "exam" SET "conducted"=${conducted}, "observation"=${exam.observation} WHERE "exam"."id"=${exam.examId}`;
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
