import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { ERoles } from 'src/auth/enums';
import { ClinicDto } from 'src/clinic/dto/clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  //register- new clinic
  async RegisterClinic(dto: ClinicDto) {
    const clinicExist = await this.prisma.clinic.findFirst({
      where: { email: dto.email },
    });
    if (clinicExist)
      throw new ForbiddenException('Email clinic arleady registered');
    const password = await argon.hash(dto.password);
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
    return clinic;
  }
}
