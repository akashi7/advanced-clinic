/* eslint-disable */
import {
  BadRequestException,
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
    id: number,
  ): {
    data: {
      userId: number;
      email: string;
      fullName: string;
      role: string;
      clinicId: number;
      id: number;
    };
    token: string;
  } {
    const token = this.Jwt.sign(
      { userId, email, fullName, role, clinicId, id },
      { secret: this.config.get('JWT_SECRET') },
    );
    return {
      data: {
        userId,
        email,
        fullName,
        role,
        clinicId,
        id,
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
    try {
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
          189,
          278,
        );
    } catch (error) {
      if (error.message === 'Admin User not found') {
        throw new NotFoundException('Admin User not found');
      } else if (error.message === 'Wrong Admin password') {
        throw new ForbiddenException('Wrong Admin password');
      }
      throw new BadRequestException('Server down');
    }
  }

  async userLogin(dto: userSignInDto): Promise<{}> {
    try {
      const isActive = await this.prisma.user.findFirst({
        where: { AND: [{ isActive: true }, { email: dto.email }] },
      });
      const user = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });
      if (!isActive && user) throw new ForbiddenException('User is disabled');
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
        user.id,
      );
    } catch (error) {
      if (error.message === 'User is disabled') {
        throw new ForbiddenException('User is disabled');
      }
      if (error.message === 'Wrong password') {
        throw new ForbiddenException('Wrong password');
      }
      if (error.message === 'User not found') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Server down');
    }
  }
}
