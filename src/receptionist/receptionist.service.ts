/* eslint-disable */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  invoice,
  invoice_details,
  patient,
  payment,
  records,
  User,
} from '@prisma/client';
import { endOfDay, getYear, startOfDay } from 'date-fns';
import { ERecords, ERoles, EStatus } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  FilterPatients,
  FilterRecordDto,
  MakePaymentDto,
  RecordDto,
  registerPatientDto,
} from './dto';

@Injectable()
export class ReceptionistService {
  constructor(private readonly prisma: PrismaService) {}

  //register patient
  async RegisterPatient(dto: registerPatientDto, user: User): Promise<patient> {
    let code: string;

    if (dto.isInfant && dto.isInfant === true) {
      const isInfants = await this.prisma.patient.findFirst({
        where: {
          AND: [
            {
              clinicId: user.clinicId,
            },
            {
              isInfant: true,
            },
            {
              fullName: dto.fullName,
            },
          ],
          OR: [
            { FatherIdnumber: dto?.FatherIdNumber },
            { MotherIdnumber: dto?.MotherIdnumber },
            { GuardianIdNumber: dto?.GuardianIdNumber },
          ],
        },
      });
      if (isInfants) throw new ConflictException('Infant already exists');

      const patients = await this.prisma.patient.findMany({
        where: {
          clinicId: user.clinicId,
        },
      });

      const clinic = await this.prisma.clinic.findFirst({
        where: {
          id: user.clinicId,
        },
      });

      if (patients.length < 1) {
        code = `${clinic.name.substring(0, 2)}0001`;
      }
      if (patients.length > 0) {
        let Obj = patients[patients.length - 1];
        let previousCode = Obj.code.replace(
          `${clinic.name.substring(0, 2)}`,
          '',
        );

        if (parseInt(previousCode) <= 9) {
          code = `${clinic.name.substring(0, 2)}000${
            parseInt(previousCode) + 1
          }`;
        }

        if (parseInt(previousCode) > 9 && parseInt(previousCode) < 99) {
          code = `${clinic.name.substring(0, 2)}00${
            parseInt(previousCode) + 1
          }`;
        } else if (
          parseInt(previousCode) >= 99 &&
          parseInt(previousCode) < 999
        ) {
          code = `${clinic.name.substring(0, 2)}0${parseInt(previousCode) + 1}`;
        } else {
          code = `${clinic.name.substring(0, 2)}${parseInt(previousCode) + 1}`;
        }
      }

      const age: number = getYear(new Date()) - getYear(new Date(dto.DOB));

      const Infant = await this.prisma.patient.create({
        data: {
          fullName: dto.fullName,
          DOB: dto.DOB,
          phone: dto.phone,
          age,
          code,
          gender: dto.gender,
          sector: dto.sector,
          village: dto.village,
          province: dto.province,
          district: dto.district,
          clinicId: user.clinicId,
          GuardianNames: dto.GuardianNames,
          GuardianPhone: dto.GuardianPhone,
          GuardianIdNumber: dto.GuardianIdNumber,
          isInfant: dto.isInfant,
          FatherName: dto.FatherName,
          MotherName: dto.MotherName,
          FatherIdnumber: dto.FatherIdNumber,
          MotherIdnumber: dto.MotherIdnumber,
          FatherPhone: dto.FatherPhone,
          MotherPhone: dto.MotherPhone,
        },
      });
      return Infant;

      // const enfant = await this.prisma
      //   .$queryRaw`SELECT * FROM "patient" WHERE "clinicId" = ${user.clinicId} AND "isInfant" = true  AND("FatherIdnumber" = ${dto?.FatherIdNumber} OR "MotherIdnumber" = ${dto?.MotherIdnumber} OR "GuardianIdNumber" = ${dto?.GuardianIdNumber})`;
      // console.log({ enfant });
    }

    const isPatient = await this.prisma.patient.findFirst({
      where: {
        AND: [{ clinicId: user.clinicId }, { idNumber: dto.idNumber }],
      },
    });
    if (isPatient) {
      throw new ConflictException(
        `Patient is arleady registered by the names of ${isPatient.fullName}`,
      );
    }
    const patients = await this.prisma.patient.findMany({
      where: {
        clinicId: user.clinicId,
      },
    });

    const clinic = await this.prisma.clinic.findFirst({
      where: {
        id: user.clinicId,
      },
    });

    if (patients.length < 1) {
      code = `${clinic.name.substring(0, 2)}0001`;
    } else if (patients.length > 0) {
      let Obj = patients[patients.length - 1];
      let previousCode = Obj.code.replace(`${clinic.name.substring(0, 2)}`, '');
      console.log({ previousCode });

      if (parseInt(previousCode) <= 9) {
        code = `${clinic.name.substring(0, 2)}000${parseInt(previousCode) + 1}`;
      }

      if (parseInt(previousCode) > 9 && parseInt(previousCode) < 99) {
        code = `${clinic.name.substring(0, 2)}00${parseInt(previousCode) + 1}`;
      } else if (parseInt(previousCode) >= 99 && parseInt(previousCode) < 999) {
        code = `${clinic.name.substring(0, 2)}0${parseInt(previousCode) + 1}`;
      } else {
        code = `${clinic.name.substring(0, 2)}${parseInt(previousCode) + 1}`;
      }
    }
    const age: number = getYear(new Date()) - getYear(new Date(dto.DOB));

    const patient = await this.prisma.patient.create({
      data: {
        fullName: dto.fullName,
        DOB: dto.DOB,
        phone: dto.phone,
        gender: dto.gender,
        sector: dto.sector,
        village: dto.village,
        province: dto.province,
        age,
        code,
        district: dto.district,
        email: dto.email,
        marital_status: dto.marital_status,
        clinicId: user.clinicId,
        idNumber: dto.idNumber,
      },
    });
    return patient;
  }

  //see all patients
  async getAllPatients(user: User): Promise<patient[]> {
    const patients = await this.prisma.patient.findMany({
      where: { clinicId: user.clinicId },
    });
    return patients;
  }

  async filterPatients(dto: FilterPatients, user: User): Promise<patient[]> {
    if (dto.fullName) {
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            {
              fullName: {
                mode: 'insensitive',
                contains: dto.fullName,
              },
            },
          ],
        },
      });
      return patients;
    } else if (dto.idNumber) {
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [{ clinicId: user.clinicId }],
          OR: [
            { idNumber: dto.idNumber },
            { FatherIdnumber: dto.idNumber },
            { MotherIdnumber: dto.idNumber },
            { GuardianIdNumber: dto.idNumber },
          ],
        },
      });
      return patients;
    } else if (dto.code) {
      const patients = await this.prisma.patient.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            {
              code: {
                mode: 'insensitive',
                contains: dto.code,
              },
            },
          ],
        },
      });
      return patients;
    }
  }

  //send to nurse for examination
  async CreateRecord(
    pId: number,
    user: User,
    dto: RecordDto,
    pCode: string,
  ): Promise<{ message: string }> {
    let Dto = new RecordDto();
    Dto.amountToBePaid = 0;
    Dto.amountPaid = 0;
    Dto.unpaidAmount = 0;
    Dto.amountPaidByInsurance = 0;
    let priceToPay: number;
    let insurancePaid: number;
    let insuranceRate: number;

    const patient = await this.prisma.patient.findFirst({
      where: { id: pId },
    });

    const Nurse = await this.prisma.user.findFirst({
      where: { id: parseInt(dto.nurse) },
    });

    const record = await this.prisma.records.create({
      data: {
        patientId: pId,
        clinicId: user.clinicId,
        fullNames: patient.fullName,
        nurse: Nurse.fullName,
        status: EStatus.ACTIVE,
        insurance: dto.insuranceId,
        rate: dto.rate,
        patientCode: pCode,
        services: [],
      },
    });
    await this.prisma.record_details.create({
      data: {
        recordId: record.record_code,
        fullNames: record.fullNames,
        destination: ERecords.NURSE_DESTINATION,
        status: EStatus.UNREAD,
        nurse: record.nurse,
      },
    });

    // const invoice = await this.prisma.invoice.create({
    //   data: {
    //     patientId: pId,
    //     recordId: record.record_code,
    //     rating: dto.rate,
    //     insuranceId: dto.insuranceId,
    //     clinicId: user.clinicId,
    //     amountPaid: Dto.amountPaid,
    //     amountToBePaid: Dto.amountToBePaid,
    //     unpaidAmount: Dto.unpaidAmount,
    //     amountPaidByInsurance: Dto.amountPaidByInsurance,
    //   },
    // });
    // const itemPrice = await this.prisma.priceList.findFirst({
    //   where: {
    //     AND: [
    //       { itemId: dto.itemId },
    //       { Type: 'consultation' },
    //       { insuranceId: dto.insuranceId },
    //       { clinicId: user.clinicId },
    //     ],
    //   },
    // });
    // if (!itemPrice) {
    //   throw new BadRequestException('consultation not in priceList');
    // }
    // priceToPay = itemPrice.price - (itemPrice.price * parseInt(dto.rate)) / 100;
    // insuranceRate = 100 - parseInt(dto.rate);
    // insurancePaid = itemPrice.price - (itemPrice.price * insuranceRate) / 100;

    // await this.prisma.invoice_details.create({
    //   data: {
    //     invoiceId: invoice.id,
    //     itemId: dto.itemId,
    //     type: 'consultation',
    //     price: itemPrice.price,
    //     priceToPay,
    //     insurancePaid,
    //   },
    // });

    // await this.prisma.invoice.update({
    //   data: {
    //     amountPaid: 0,
    //     amountPaidByInsurance: insurancePaid,
    //     amountToBePaid: priceToPay,
    //     unpaidAmount: priceToPay,
    //   },
    //   where: {
    //     id: invoice.id,
    //   },
    // });

    return { message: 'Record created successfully' };
  }

  //see records

  async seeRecords(dto: FilterRecordDto, user: User): Promise<records[]> {
    let today = new Date();

    if (dto.status) {
      if (dto.recordDate) {
        const validate = new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!validate.test(dto.recordDate)) {
          throw new BadRequestException(
            'Invalid date format , format must be YYYY-MM-DD',
          );
        }
        today = new Date(dto.recordDate);
        const records = await this.prisma.records.findMany({
          where: {
            AND: [
              { clinicId: user.clinicId },
              { createdAt: { gte: startOfDay(today) } },
              { createdAt: { lte: endOfDay(today) } },
              { recordStatus: EStatus.FINISHED },
            ],
          },
        });
        records.reverse();
        return records;
      }
      const records = await this.prisma.records.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { createdAt: { gte: startOfDay(today) } },
            { createdAt: { lte: endOfDay(today) } },
            { recordStatus: EStatus.FINISHED },
          ],
        },
      });
      records.reverse();
      return records;
    } else if (dto.recordDate) {
      const validate = new RegExp(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!validate.test(dto.recordDate)) {
        throw new BadRequestException(
          'Invalid date format , format must be YYYY-MM-DD',
        );
      }
      today = new Date(dto.recordDate);
      const records = await this.prisma.records.findMany({
        where: {
          AND: [
            { clinicId: user.clinicId },
            { createdAt: { gte: startOfDay(today) } },
            { createdAt: { lte: endOfDay(today) } },
          ],
        },
      });
      records.reverse();
      return records;
    }
    const records = await this.prisma.records.findMany({
      where: {
        AND: [
          { clinicId: user.clinicId },
          { createdAt: { gte: startOfDay(today) } },
          { createdAt: { lte: endOfDay(today) } },
        ],
      },
    });
    records.reverse();
    return records;
  }

  async seeRecordPayment(recordId: number): Promise<payment[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        recordId,
      },
    });

    let payment: any[];
    let consultations: any[];
    let exams: any[];

    let xkey = payments.map((obj) => {
      return obj.type;
    });

    if (xkey.includes('consultation')) {
      consultations = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId"="consultation"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."recordId"=${recordId}`;
      let filteredC = consultations.map((obj) => {
        return {
          id: obj.id,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
          amount: obj.amount,
          insurancePaid: obj.insurancePaid,
          insurance: obj.name,
          rate: obj.rate,
          name: obj.type,
          Type: 'consultation',
        };
      });
      payment = filteredC;
    } else if (xkey.includes('exam')) {
      exams = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId"="examList"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."recordId"=${recordId}`;
      let filteredC = exams.map((obj) => {
        return {
          id: obj.id,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
          amount: obj.amount,
          insurancePaid: obj.insurancePaid,
          insurance: obj.name,
          rate: obj.rate,
          name: obj.Name,
          Type: 'exam',
        };
      });
      payment = filteredC;
    } else if (xkey.includes('exam') && xkey.includes('consultation')) {
      consultations = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId"="consultation"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."recordId"=${recordId}`;
      exams = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId"="examList"."id" LEFT JOIN "insurance" ON "payment"."insuranceId"="insurance"."id" WHERE "payment"."recordId"=${recordId}`;

      let E = exams.map((obj) => {
        return {
          id: obj.id,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
          amount: obj.amount,
          insurancePaid: obj.insurancePaid,
          insurance: obj.name,
          rate: obj.rate,
          name: obj.Name,
          Type: 'exam',
        };
      });
      let C = consultations.map((obj) => {
        return {
          id: obj.id,
          createdAt: obj.createdAt,
          updatedAt: obj.updatedAt,
          amount: obj.amount,
          insurancePaid: obj.insurancePaid,
          insurance: obj.name,
          rate: obj.rate,
          name: obj.type,
          Type: 'consultation',
        };
      });
      payment = [...C, ...E];
    }
    return payment;
  }

  async viewOneRecordPayment(
    paymentId: number,
    type: string,
  ): Promise<unknown> {
    if (type === 'consultation') {
      const payment = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "consultation" ON "payment"."itemId" = "consultation"."id" WHERE "payment"."id" = ${paymentId} `;
      return payment;
    }
    if (type === 'exam') {
      const payment = await this.prisma
        .$queryRaw`SELECT * FROM "payment" LEFT JOIN "examList" ON "payment"."itemId" = "examList"."id" WHERE "payment"."id" = ${paymentId}`;
      return payment;
    }
  }

  async activateRecord(id: number): Promise<{ message: string }> {
    const record = await this.prisma.records.findFirst({
      where: { record_code: id },
    });
    if (!record) throw new NotFoundException('Record not found');
    await this.prisma.records.update({
      where: { record_code: id },
      data: { status: EStatus.ACTIVE },
    });
    if (record.nurse) {
      await this.prisma.record_details.create({
        data: {
          recordId: record.record_code,
          fullNames: record.fullNames,
          destination: ERecords.NURSE_DESTINATION,
          status: EStatus.UNREAD,
          nurse: record.nurse,
        },
      });
    }
    if (!record.nurse) {
      await this.prisma.record_details.create({
        data: {
          recordId: record.record_code,
          fullNames: record.fullNames,
          destination: ERecords.DOCTOR_DESTINATION,
          status: EStatus.UNREAD,
          doctor: record.doctor,
        },
      });
    }

    return { message: 'Record activated' };
  }

  async makePayment(
    id: number,
    dto: MakePaymentDto,
    user: User,
  ): Promise<{ message: string }> {
    let message: string;
    let unpaidAmount: number;
    let amountPaid: number;
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
      await this.prisma.invoice.update({
        data: {
          unpaidAmount,
          amountPaid,
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

  async viewInvoiceOfRecord(
    recordId: number,
  ): Promise<{ Invoice: invoice; Patient: patient }> {
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        recordId,
      },
      include: {
        invoice_details: true,
      },
    });

    const patient = await this.prisma.patient.findFirst({
      where: { id: invoice.patientId },
    });

    return { Invoice: invoice, Patient: patient };
  }

  async viewInvoiceDetails(invoiceId: number): Promise<invoice_details[]> {
    const invoice_details = await this.prisma.invoice_details.findMany({
      where: {
        id: invoiceId,
      },
    });
    return invoice_details;
  }

  async allDoctors(user: User): Promise<User[]> {
    const doctors = await this.prisma.user.findMany({
      where: { AND: [{ clinicId: user.clinicId }, { role: ERoles.DOCTOR }] },
    });
    return doctors;
  }

  async allNurses(user: User): Promise<User[]> {
    const nurses = await this.prisma.user.findMany({
      where: {
        AND: [{ clinicId: user.clinicId }],
        OR: [{ role: ERoles.NURSE }, { asignedRole: { has: ERoles.NURSE } }],
      },
    });

    return nurses;
  }

  async allLaborantes(user: User): Promise<User[]> {
    const laborantes = await this.prisma.user.findMany({
      where: { AND: [{ clinicId: user.clinicId }, { role: ERoles.LABORANTE }] },
    });
    return laborantes;
  }

  async receptionistReport(user: User) {
    const records = await this.prisma.records.count({
      where: { clinicId: user.clinicId },
    });
    const activeRecords = await this.prisma.records.count({
      where: { AND: [{ clinicId: user.clinicId }, { status: 'active' }] },
    });
    const pendingRecords = await this.prisma.records.count({
      where: {
        AND: [{ clinicId: user.clinicId }, { recordStatus: EStatus.PENDING }],
      },
    });
    const patients = await this.prisma.patient.count({
      where: { clinicId: user.clinicId },
    });
    const childrens = await this.prisma.patient.count({
      where: { AND: [{ clinicId: user.clinicId }, { isInfant: true }] },
    });
    const adutls = await this.prisma.patient.count({
      where: { AND: [{ clinicId: user.clinicId }, { isInfant: false }] },
    });

    return {
      totalRecords: records,
      totalActiveRecords: activeRecords,
      totatalPendingRecords: pendingRecords,
      totalPatients: patients,
      totalChildrens: childrens,
      totalAdults: adutls,
    };
  }

  async updatePatient(dto: registerPatientDto, id: number) {
    await this.prisma.patient.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }
}
