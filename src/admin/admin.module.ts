import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { HashPasswordMiddleware } from '../middle/hash-password/hash-password.middleware';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity, UserEntity])],
  controllers: [AdminController],
  providers: [AdminService, UserService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HashPasswordMiddleware).forRoutes('/');
  }
}
