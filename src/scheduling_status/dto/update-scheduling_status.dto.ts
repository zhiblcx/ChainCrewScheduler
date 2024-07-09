import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedulingStatusDto } from './create-scheduling_status.dto';

export class UpdateSchedulingStatusDto extends PartialType(CreateSchedulingStatusDto) {}
