import { Module } from '@nestjs/common';
import { SchedulingTimerService } from './scheduling_timer.service';
import { SchedulingTimerController } from './scheduling_timer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulingTimer } from './entities/scheduling_timer.entity';
import { SchedulingRuleService } from 'src/scheduling_rule/scheduling_rule.service';
import { SchedulingRule } from 'src/scheduling_rule/entities/scheduling_rule.entity';
import { SchedulingStatus } from 'src/scheduling_status/entities/scheduling_status.entity';
import { SchedulingStatusService } from 'src/scheduling_status/scheduling_status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SchedulingTimer,
      SchedulingRule,
      SchedulingStatus,
    ]),
  ],
  controllers: [SchedulingTimerController],
  providers: [
    SchedulingTimerService,
    SchedulingRuleService,
    SchedulingStatusService,
  ],
})
export class SchedulingTimerModule {}
