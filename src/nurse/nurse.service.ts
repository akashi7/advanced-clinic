import { BadRequestException, Injectable } from '@nestjs/common';
import { records, record_details, User } from '@prisma/client';
import { ERecords, ERoles, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { medicalHistoryDto, ReommendConsultationDto, vitalsDto } from './dto';

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
    record.reverse();
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
        medicalHistory: true,
        symptoms: true,
        chronicDesease: true,
      },
    });

    return record;
  }

  async nurseRgisterMedicalInformation(
    recordId: number,
    dto: medicalHistoryDto,
    user: User,
  ): Promise<{ message: string }> {
    const record = await this.prisma.records.findFirst({
      where: { record_code: recordId },
    });

    await this.prisma.records.update({
      where: {
        record_code: record.record_code,
      },
      data: {
        newCase: dto.case,
      },
    });

    await this.prisma.medicalHistory.create({
      data: {
        firstAid: dto.firstAid,
        observation: dto.observation,
        recordId,
        symptoms: dto.symptoms,
        chronicDesease: dto.diseases,
        medications: dto.medications,
        medicationType: dto.medications ? dto.medicationType : [],
        HowLong: dto.HowLong,
      },
    });
    await this.prisma.sign_vital.create({
      data: {
        ...dto,
        patientId: record.patientId,
        recordId,
      },
    });
    const message = await this.recomendConsultation(dto, user, recordId);
    if (message) {
      return { message: 'registered succesfully' };
    }
  }

  async nurseSendToDoc(
    recordId: number,
    doctorId: number,
  ): Promise<{ message: string }> {
    const record = await this.prisma.records.findFirst({
      where: {
        record_code: recordId,
      },
    });

    const doctor = await this.prisma.user.findFirst({
      where: {
        id: doctorId,
      },
    });

    await this.prisma.record_details.create({
      data: {
        recordId: record.record_code,
        fullNames: record.fullNames,
        destination: ERecords.DOCTOR_DESTINATION,
        status: EStatus.UNREAD,
        doctor: doctor.fullName,
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

  async allDoctors(user: User): Promise<User[]> {
    const doctors = await this.prisma.user.findMany({
      where: { AND: [{ clinicId: user.clinicId }, { role: ERoles.DOCTOR }] },
    });
    return doctors;
  }

  async recomendConsultation(
    dto: ReommendConsultationDto,
    user: User,
    recordId: number,
  ): Promise<{ message: string }> {
    const record = await this.prisma.records.findFirst({
      where: {
        record_code: recordId,
      },
    });

    const itemPrice = await this.prisma.priceList.findFirst({
      where: {
        AND: [
          { itemId: dto.itemId },
          { Type: 'consultation' },
          { insuranceId: record.insurance },
          { clinicId: user.clinicId },
        ],
      },
    });
    if (!itemPrice) {
      throw new BadRequestException('consultation not in priceList');
    }

    const priceToPay: number =
      itemPrice.price - (itemPrice.price * record.rate) / 100;
    const insuranceRate: number = 100 - record.rate;
    const insurancePaid: number =
      itemPrice.price - (itemPrice.price * insuranceRate) / 100;

    const invoice = await this.prisma.invoice.create({
      data: {
        patientId: record.patientId,
        recordId,
        clinicId: user.clinicId,
        amountPaid: 0,
        amountToBePaid: priceToPay,
        unpaidAmount: priceToPay,
        amountPaidByInsurance: insurancePaid,
      },
    });

    await this.prisma.invoice_details.create({
      data: {
        invoiceId: invoice.id,
        itemId: dto.itemId,
        type: 'consultation',
        price: itemPrice.price,
        priceToPay,
        insurancePaid: insurancePaid,
      },
    });

    return {
      message: 'Consultation added success',
    };
  }
}
