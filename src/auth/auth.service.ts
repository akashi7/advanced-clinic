/* eslint-disable */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { clinicSignDto } from 'src/clinic/dto/clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AuthAdminSignIn,
  AuthAdminSignUpDto,
  userSignInDto,
} from './dto/auth.dto';
import { ERoles } from './enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateToken(id: number, email: string, contact: string, role: string) {
    const token = this.Jwt.sign(
      { id, email, contact, role },
      { expiresIn: '2h', secret: this.config.get('JWT_SECRET') },
    );
    return { token };
  }

  async adminSignUp(dto: AuthAdminSignUpDto) {
    const user = await this.prisma.admin.findFirst({
      where: { email: dto.email },
    });
    if (!user) {
      const password = await argon.hash(dto.password);
      const newUser = await this.prisma.admin.create({
        data: {
          email: dto.email,
          password,
          contact: dto.contact,
          fullNames: dto.fullNames,
          role: ERoles.SUPER_ADMIN,
        },
      });

      delete newUser.password;
      return newUser;
    } else throw new ConflictException('Admin arleady exist');
  }

  async adminLogin(dto: AuthAdminSignIn) {
    const admin = await this.prisma.admin.findFirst({
      where: { email: dto.email },
    });
    if (!admin) {
      throw new ForbiddenException('Admin User not found');
    } else if (!(await argon.verify(admin.password, dto.password))) {
      throw new ForbiddenException('Wrong Admin password');
    } else
      return this.generateToken(
        admin.id,
        admin.email,
        admin.contact,
        admin.role,
      );
  }

  async userLogin(dto: userSignInDto) {}

  async clinicLogin(dto: clinicSignDto) {
    const clinic = await this.prisma.clinic.findFirst({
      where: { email: dto.email },
    });
    if (!clinic) throw new ForbiddenException('clinic not found');
    if (!(await argon.verify(clinic.password, dto.password))) {
      throw new ForbiddenException('Wrong password');
    }
    return this.generateToken(
      clinic.id,
      clinic.email,
      clinic.contact,
      clinic.role,
    );
  }
}
