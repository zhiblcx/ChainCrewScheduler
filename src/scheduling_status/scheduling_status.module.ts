import { Module } from '@nestjs/common';
import { SchedulingStatusService } from './scheduling_status.service';
import { SchedulingStatusController } from './scheduling_status.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulingStatus } from './entities/scheduling_status.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { SchedulingTimerService } from 'src/scheduling_timer/scheduling_timer.service';
import { SchedulingTimer } from 'src/scheduling_timer/entities/scheduling_timer.entity';
import { SchedulingRule } from 'src/scheduling_rule/entities/scheduling_rule.entity';
import { SchedulingRuleService } from 'src/scheduling_rule/scheduling_rule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SchedulingStatus,
      UserEntity,
      SchedulingTimer,
      SchedulingRule,
    ]),
  ],
  controllers: [SchedulingStatusController],
  providers: [
    SchedulingStatusService,
    UserService,
    SchedulingTimerService,
    SchedulingRuleService,
  ],
})
export class SchedulingStatusModule {}
