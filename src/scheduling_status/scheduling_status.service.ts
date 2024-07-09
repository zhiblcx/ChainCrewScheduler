import { Injectable } from '@nestjs/common';
import { CreateSchedulingStatusDto } from './dto/create-scheduling_status.dto';
import { UpdateSchedulingStatusDto } from './dto/update-scheduling_status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulingStatus } from './entities/scheduling_status.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';

@Injectable()
export class SchedulingStatusService {
  constructor(
    @InjectRepository(SchedulingStatus)
    private readonly scheduling_statusRepository: Repository<SchedulingStatus>,
  ) {}

  async create(createSchedulingStatusDto: CreateSchedulingStatusDto) {
    return await this.scheduling_statusRepository.save(
      createSchedulingStatusDto,
    );
  }

  async findAll(id: number) {
    return await this.scheduling_statusRepository.find({
      where: { store_id: id },
    });
  }

  async findUser(store_id: number, id: number) {
    return await this.scheduling_statusRepository.find({
      where: { store_id: store_id, user_id: id },
    });
  }

  update(id: number, updateSchedulingStatusDto: UpdateSchedulingStatusDto) {
    return this.scheduling_statusRepository.update(
      id,
      updateSchedulingStatusDto,
    );
  }

  baseTimerUser(timer: string, store_id: number, user_id: number) {
    return this.scheduling_statusRepository.findOne({
      where: { timer, store_id, user_id },
    });
  }

  deleteNextWeek() {
    const startOfWeek = dayjs().startOf('week').add(1, 'week');
    for (let i = 0; i < 7; i++) {
      this.scheduling_statusRepository.delete({
        timer: dayjs(startOfWeek).add(i, 'day').format('YYYY/MM/DD'),
      });
    }
  }
}
