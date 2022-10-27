import { Injectable } from '@nestjs/common';
import { invoice, patient, payment, User } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { MakePaymentDto } from 'src/receptionist/dto';
import { cashierDto } from './dto';

@Injectable()
export class CashierService {
  constructor(private readonly prisma: PrismaService) {}
  async GetRecordInvoice(
    patientCode: string,
    dto: cashierDto,
    user: User,
  ): Promise<{ Invoice: invoice | object; Patient: patient }> {
    if (dto.date) {
      const today = new Date(dto.date);
      const record = await this.prisma.records.findFirst({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { patientCode },
            { createdAt: { gte: startOfDay(today) } },
            { createdAt: { lte: endOfDay(today) } },
          ],
        },
      });
      if (record) {
        const invoice = await this.prisma.invoice.findFirst({
          where: {
            recordId: record.record_code,
          },
          include: {
            invoice_details: true,
          },
        });

        const patient = await this.prisma.patient.findFirst({
          where: {
            id: record.patientId,
          },
        });
        return { Invoice: invoice, Patient: patient };
      }
      if (!record) {
        const patient = await this.prisma.patient.findFirst({
          where: {
            code: patientCode,
          },
        });
        return { Invoice: {}, Patient: patient };
      }
    } else {
      const record = await this.prisma.records.findFirst({
        where: {
          AND: [{ clinicId: user.clinicId }, { patientCode }],
        },
      });
      if (record) {
        const invoice = await this.prisma.invoice.findFirst({
          where: {
            recordId: record.record_code,
          },
          include: {
            invoice_details: true,
          },
        });

        const patient = await this.prisma.patient.findFirst({
          where: {
            id: record.patientId,
          },
        });
        return { Invoice: invoice, Patient: patient };
      }
      if (!record) {
        const patient = await this.prisma.patient.findFirst({
          where: {
            code: patientCode,
          },
        });
        return { Invoice: {}, Patient: patient };
      }
    }
  }

  async makePayment(
    id: number,
    dto: MakePaymentDto,
    user: User,
  ): Promise<{ message: string }> {
    let message: string;
    let unpaidAmount: number;
    let amountPaid: number;
    let hasPayed: boolean;
    const record = await this.prisma.records.findFirst({
      where: { record_code: id },
    });
    const invoice = await this.prisma.invoice.findFirst({
      where: { recordId: record.record_code },
    });

    const insurance = this.prisma.insurance.findFirst({
      where: { AND: [{ clinicId: user.clinicId }, { id: record.insurance }] },
    });

    dto.cart.forEach(async (item) => {
      const invoice_details = await this.prisma.invoice_details.findFirst({
        where: { id: item.id },
      });
      await this.prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: item.pricePaid,
          itemId: invoice_details.itemId,
          type: invoice_details.type,
          recordId: record.record_code,
          insurancePaid: invoice.amountPaidByInsurance,
          insuranceId: (await insurance).id,
          clinicId: user.clinicId,
        },
      });
      unpaidAmount = invoice.unpaidAmount - item.pricePaid;
      amountPaid = invoice.amountPaid + item.pricePaid;
      amountPaid < invoice.amountToBePaid
        ? (hasPayed = false)
        : (hasPayed = true);
      await this.prisma.invoice.update({
        data: {
          unpaidAmount,
          amountPaid,
          hasPayed,
        },
        where: {
          id: invoice.id,
        },
      });
      await this.prisma
        .$queryRaw`UPDATE "invoice_details" SET "hasPaid" = ${true} WHERE "invoiceId" = ${
        invoice.id
      } AND "itemId" = ${invoice_details.itemId}`;

      message = 'Payment made successfully';
    });
    if (message) return { message };
  }

  async seeRecordPayment(recordId: number): Promise<payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        recordId,
      },
    });

    const xkey = payments.map((obj) => {
      if (obj.type === 'exam') {
        obj.type = 'examList';
      }
      return obj;
    });

    let j = await Promise.all(
      xkey.map(async (obj) => {
        let result = await this.prisma[`${obj.type}`][`findFirst`]({
          where: {
            id: obj.itemId,
          },
        });
        let Name = result.type
          ? result.type
          : result.item
          ? result.item
          : result.Name;
        return {
          Id: obj.id,
          Name,
        };
      }),
    );

    let payment = [];
    xkey.forEach((e) => {
      let valueTime = j.find((ee) => ee.Id === e.id);
      if (valueTime) {
        payment.push({ ...e, Name: valueTime.Name });
      } else {
        payment.push({ ...e });
      }
    });

    return payment;
  }
}
