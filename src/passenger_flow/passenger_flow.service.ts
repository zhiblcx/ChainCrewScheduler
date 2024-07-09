import { Injectable } from '@nestjs/common';
import { CreatePassengerFlowDto } from './dto/create-passenger_flow.dto';
import { UpdatePassengerFlowDto } from './dto/update-passenger_flow.dto';
import { PassengerFlow } from './entities/passenger_flow.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PassengerFlowService {
  constructor(
    @InjectRepository(PassengerFlow)
    private readonly passengerFlowService: Repository<PassengerFlow>,
  ) {}
  create(createPassengerFlowDto: CreatePassengerFlowDto) {
    return this.passengerFlowService.save(createPassengerFlowDto);
  }

  findAll(store_id: number) {
    return this.passengerFlowService.find({ where: { store_id: store_id } });
  }

  findOne(id: number) {
    return `This action returns a #${id} passengerFlow`;
  }

  update(id: number, updatePassengerFlowDto: UpdatePassengerFlowDto) {
    return `This action updates a #${id} passengerFlow`;
  }

  remove(id: number) {
    return `This action removes a #${id} passengerFlow`;
  }
}
