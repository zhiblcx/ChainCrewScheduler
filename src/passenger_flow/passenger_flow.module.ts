import { Module } from '@nestjs/common';
import { PassengerFlowService } from './passenger_flow.service';
import { PassengerFlowController } from './passenger_flow.controller';
import { PassengerFlow } from './entities/passenger_flow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerFlow])],
  controllers: [PassengerFlowController],
  providers: [PassengerFlowService],
})
export class PassengerFlowModule {}
