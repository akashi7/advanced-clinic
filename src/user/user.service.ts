import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { UpdatePasswordDto } from 'src/clinic/dto/clinic.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async userProfile(user: User): Promise<User> {
    const User = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    delete User.password;
    delete User.isActive;
    delete User.clinicId;
    return User;
  }

  async updateUserPassword(
    user: User,
    dto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const isUser = await this.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!(await argon.verify(isUser.password, dto.oldPassword))) {
      throw new ForbiddenException('Wrong password');
    }
    if (dto.newPassword !== dto.confirmPassword) {
      throw new ForbiddenException('new Passwords do not match');
    }
    const password = await argon.hash(dto.newPassword);
    await this.prisma.user.update({
      data: {
        password,
      },
      where: {
        id: user.id,
      },
    });
    return {
      message: 'Password updated succesfully',
    };
  }
}
