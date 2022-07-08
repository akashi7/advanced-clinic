/* eslint-disable */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/client';
import * as argon from 'argon2';
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

  generateToken(
    userId: number,
    email: string,
    fullName: string,
    role: string,
    clinicId: number,
  ): {
    data: {
      userId: number;
      email: string;
      fullName: string;
      role: string;
      clinicId: number;
    };
    token: string;
  } {
    const token = this.Jwt.sign(
      { userId, email, fullName, role, clinicId },
      { expiresIn: '2h', secret: this.config.get('JWT_SECRET') },
    );
    return {
      data: {
        userId,
        email,
        fullName,
        role,
        clinicId,
      },
      token,
    };
  }

  async adminSignUp(dto: AuthAdminSignUpDto): Promise<Admin> {
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

  async adminLogin(dto: AuthAdminSignIn): Promise<{}> {
    const admin = await this.prisma.admin.findFirst({
      where: { email: dto.email },
    });
    if (!admin) throw new NotFoundException('Admin User not found');
    else if (!(await argon.verify(admin.password, dto.password))) {
      throw new ForbiddenException('Wrong Admin password');
    } else
      return this.generateToken(
        admin.id,
        admin.email,
        admin.contact,
        admin.role,
        1,
      );
  }

  async userLogin(dto: userSignInDto): Promise<{}> {
    let verified = true;
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, AND: [{ isActive: true }] },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!(await argon.verify(user.password, dto.password))) {
      throw new ForbiddenException('Wrong password');
    }
    return this.generateToken(
      user.userId,
      user.email,
      user.fullName,
      user.role,
      user.clinicId,
    );
  }
}
