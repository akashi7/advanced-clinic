import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { ClinicDto } from 'src/clinic/dto/clinic.dto';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  makePassword(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  //register- new clinic
  async RegisterClinic(dto: ClinicDto) {
    const clinicExist = await this.prisma.clinic.findFirst({
      where: { email: dto.email },
    });
    if (clinicExist)
      throw new ForbiddenException('Email clinic arleady registered');
    const passwordGenerated = this.makePassword(8);
    const password = await argon.hash(passwordGenerated);
    const clinic = await this.prisma.clinic.create({
      data: {
        name: dto.name,
        province: dto.province,
        district: dto.district,
        sector: dto.sector,
        cell: dto.cell,
        village: dto.village,
        email: dto.email,
        password,
        contact: dto.contact,
        role: ERoles.CLINIC,
        type: 'o',
        address: dto.address,
      },
    });
    delete clinic.password;
    return this.mail.sendMail(
      clinic.email,
      `${clinic.name} credentials`,
      '"No Reply" <noreply@kuranga.com>',
      `${passwordGenerated}`,
    );
  }
}
