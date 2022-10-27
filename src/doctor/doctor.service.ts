import { BadRequestException, Injectable } from '@nestjs/common';
import {
  appointement,
  patient,
  records,
  record_details,
  User,
} from '@prisma/client';
import { ERecords, ERoles, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AppointmentDto,
  examDto,
  FilterAppointments,
  FilterResult,
  ObservationDto,
} from './dto';

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
      record.reverse();
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
    record.reverse();
    return record;
  }

  async docViewRequet(id: number): Promise<{
    record: records;
    exams: unknown;
    patient: patient;
    insurance: string;
    givenFistAid: { itemName: string }[];
  }> {
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
        medicalHistory: true,
        sign_vital: true,
      },
    });
    const patient = await this.prisma.patient.findFirst({
      where: {
        id: record.patientId,
      },
    });

    const history = record.medicalHistory.map((item) => {
      // item.firstAid.push('2', '3', '4');
      return item.firstAid.toString();
    });

    let fltered = history.toString();
    let newArray = fltered.replace(/[,]+/g, '').trim().split('');

    const itemsF = await Promise.all(
      newArray.map(async (id) => {
        const stock = await this.prisma.stock.findFirst({
          where: { id: parseInt(id) },
        });
        return {
          itemName: stock.item,
        };
      }),
    );

    const examTable = await this.prisma
      .$queryRaw`SELECT "exam"."id" AS "Id", "Code","Name","clinicId","conducted","description","exam","observation","record_code"   FROM "exam" LEFT JOIN "examList" ON "exam"."exam" = "examList"."id" WHERE "exam"."record_code"=${record.record_code}`;

    await this.prisma.record_details.update({
      where: {
        id,
      },
      data: {
        status: EStatus.READ,
      },
    });

    const insurance = await this.prisma.insurance.findFirst({
      where: {
        id: record.insurance,
      },
    });

    return {
      record: record,
      exams: examTable,
      patient: patient,
      insurance: insurance.name,
      givenFistAid: itemsF,
    };
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
            { itemId: exam.itemId },
            { Type: 'exam' },
            { insuranceId: record.insurance },
            { clinicId: user.clinicId },
          ],
        },
      });

      if (!itemPrice) {
        throw new BadRequestException(`Exam not priceList `);
      }

      await this.prisma.exam.create({
        data: {
          record_code: record.record_code,
          exam: itemPrice.itemId,
        },
      });

      priceToPay = itemPrice.price - (itemPrice.price * record.rate) / 100;
      insuranceRate = 100 - record.rate;
      insurancePaid = itemPrice.price - (itemPrice.price * insuranceRate) / 100;

      await this.prisma.invoice_details.create({
        data: {
          invoiceId: invoice.id,
          itemId: exam.itemId,
          type: 'exam',
          price: itemPrice.price,
          priceToPay,
          insurancePaid: insurancePaid,
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
      where: { AND: [{ role: ERoles.LABORANTE }, { clinicId: user.clinicId }] },
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

  async makeAppointment(
    recordId: number,
    dto: AppointmentDto,
    patientCode: string,
    user: User,
  ) {
    await this.prisma.appointement.create({
      data: {
        recordId,
        patientCode: patientCode,
        reason: dto.reason,
        serviceId: dto.serviceId,
        doctorId: user.id,
        Date: dto.Date,
        medecines: dto.medecines.length > 0 ? dto.medecines : [],
        Diseases: dto.disease.length > 0 ? dto.disease : [],
      },
    });
  }

  async seeAppointnments(
    user: User,
    dto: FilterAppointments,
  ): Promise<appointement[]> {
    const today = new Date();
    if (dto.date) {
      const date = new Date(dto.date);
      const appointements = await this.prisma.appointement.findMany({
        where: { AND: [{ doctorId: user.id }, { Date: date }] },
      });
      return appointements;
    }
    const appointements = await this.prisma.appointement.findMany({
      where: { AND: [{ doctorId: user.id }, { Date: today }] },
    });
    return appointements;
  }

  async docTerminateRecordProccess(
    id: number,
    dto: ObservationDto,
  ): Promise<{ message: string }> {
    await this.prisma.records.update({
      where: {
        record_code: id,
      },
      data: {
        medecines: dto.medecines,
        disease: dto.disease,
      },
    });
    return { message: '' };
  }

  async docReport(user: User): Promise<{
    totalRequets: number;
    totalUnreadRequests: number;
    totalReadRequests: number;
  }> {
    const requests = await this.prisma.record_details.count({
      where: {
        AND: [
          { destination: ERecords.DOCTOR_DESTINATION },
          { doctor: user.fullName },
        ],
      },
    });

    const unreadRequests = await this.prisma.record_details.count({
      where: {
        AND: [
          { destination: ERecords.DOCTOR_DESTINATION },
          { doctor: user.fullName },
          { status: EStatus.UNREAD },
        ],
      },
    });

    const readRequets = await this.prisma.record_details.count({
      where: {
        AND: [
          { destination: ERecords.DOCTOR_DESTINATION },
          { doctor: user.fullName },
          { status: EStatus.READ },
        ],
      },
    });

    return {
      totalRequets: requests,
      totalUnreadRequests: unreadRequests,
      totalReadRequests: readRequets,
    };
  }
}
