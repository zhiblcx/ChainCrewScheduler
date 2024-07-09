import { PartialType } from '@nestjs/mapped-types';
import { CreateSchedulingRuleDto } from './create-scheduling_rule.dto';

export class UpdateSchedulingRuleDto extends PartialType(CreateSchedulingRuleDto) {}
