import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './entities/store.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SchedulingTimer } from 'src/scheduling_timer/entities/scheduling_timer.entity';
import { SchedulingTimerService } from 'src/scheduling_timer/scheduling_timer.service';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { AdminService } from 'src/admin/admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      UserEntity,
      SchedulingTimer,
      AdminEntity,
    ]),
  ],
  controllers: [StoreController],
  providers: [StoreService, UserService, SchedulingTimerService, AdminService],
})
export class StoreModule {}
