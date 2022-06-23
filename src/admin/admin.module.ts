/* eslint-disable */
import { Global, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { JwtModule } from '@nestjs/jwt';

@Global()

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [JwtModule.register({})],
  exports: [AdminService]
})
export class AdminModule { }
