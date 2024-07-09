import { Module } from '@nestjs/common';
import { SchedulingRuleService } from './scheduling_rule.service';
import { SchedulingRuleController } from './scheduling_rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulingRule } from './entities/scheduling_rule.entity';
import { SchedulingTimer } from 'src/scheduling_timer/entities/scheduling_timer.entity';
import { SchedulingTimerService } from 'src/scheduling_timer/scheduling_timer.service';
import { SchedulingStatus } from 'src/scheduling_status/entities/scheduling_status.entity';
import { SchedulingStatusService } from 'src/scheduling_status/scheduling_status.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SchedulingRule,
      SchedulingTimer,
      SchedulingStatus,
    ]),
  ],
  controllers: [SchedulingRuleController],
  providers: [
    SchedulingRuleService,
    SchedulingTimerService,
    SchedulingStatusService,
  ],
})
export class SchedulingRuleModule {}
