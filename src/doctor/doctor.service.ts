import { Injectable } from '@nestjs/common';
import { records, record_details, User } from '@prisma/client';
import { ERecords, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { examDto, FilterResult } from './dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async docSeeAllRequets(
    user: User,
    dto: FilterResult,
  ): Promise<record_details[]> {
    if (dto.results) {
      const record = await this.prisma.record_details.findMany({
        where: {
          AND: [
            {
              destination: ERecords.DOCTOR_DESTINATION,
              doctor: user.fullName,
              examResults: ERecords.EXAM_RESULTS,
            },
          ],
        },
      });
      return record;
    }
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
  }

  async docViewRequet(id: number): Promise<records> {
    const record_details = await this.prisma.record_details.findFirst({
      where: {
        id,
      },
    });
    const record = await this.prisma.records.findFirst({
      where: {
        record_code: record_details.recordId,
      },
      include: {
        exam: true,
        sign_vital: true,
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

    return record;
  }

  async docSendToLabo(
    user: User,
    id: number,
    dto: examDto,
  ): Promise<{ message: string }> {
    let priceToPay: number;
    let insurancePaid: number;
    let insuranceRate: number;

    const record = await this.prisma.records.findFirst({
      where: {
        record_code: id,
      },
    });
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        recordId: record.record_code,
      },
    });

    dto.exams.forEach(async (exam) => {
      const itemPrice = await this.prisma.priceList.findFirst({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { Type: 'exam' },
            { itemId: exam.itemId },
            { insuranceId: invoice.insuranceId },
          ],
        },
      });

      await this.prisma.exam.create({
        data: {
          record_code: record.record_code,
          exam: itemPrice.itemId,
        },
      });

      priceToPay =
        itemPrice.price - (itemPrice.price * parseInt(invoice.rating)) / 100;
      insuranceRate = 100 - parseInt(invoice.rating);
      insurancePaid = itemPrice.price - (itemPrice.price * insuranceRate) / 100;

      await this.prisma.invoice_details.create({
        data: {
          invoiceId: invoice.id,
          itemId: exam.itemId,
          type: 'exam',
          price: itemPrice.price,
          priceToPay,
          insurancePaid,
        },
      });

      await this.prisma.invoice.update({
        data: {
          amountPaid: invoice.amountPaid,
          amountPaidByInsurance: invoice.amountPaidByInsurance + insurancePaid,
          amountToBePaid: invoice.amountToBePaid + priceToPay,
          unpaidAmount: invoice.unpaidAmount + priceToPay,
        },
        where: {
          id: invoice.id,
        },
      });
    });

    const laborante = await this.prisma.user.findFirst({
      where: {
        id: dto.laborante,
      },
    });

    await this.prisma.record_details.create({
      data: {
        recordId: record.record_code,
        fullNames: record.fullNames,
        destination: ERecords.LABORANTE_DESTINATION,
        status: EStatus.UNREAD,
        laborante: laborante.fullName,
      },
    });

    return { message: 'Record sent to laboratory' };
  }

  async docTerminateRecordProccess(id: number): Promise<{ message: string }> {
    await this.prisma.records.update({
      where: {
        record_code: id,
      },
      data: {
        recordStatus: EStatus.FINISHED,
      },
    });
    return { message: '' };
  }
}
