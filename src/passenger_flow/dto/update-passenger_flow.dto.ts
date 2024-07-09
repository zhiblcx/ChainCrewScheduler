import { PartialType } from '@nestjs/mapped-types';
import { CreatePassengerFlowDto } from './create-passenger_flow.dto';

export class UpdatePassengerFlowDto extends PartialType(CreatePassengerFlowDto) {}
