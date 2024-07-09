import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedulingTimerDto } from './create-scheduling_timer.dto';

export class UpdateSchedulingTimerDto extends PartialType(CreateSchedulingTimerDto) {}
