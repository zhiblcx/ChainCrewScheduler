import { Injectable } from '@nestjs/common';
import { UpdateSchedulingTimerDto } from './dto/update-scheduling_timer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulingTimer } from './entities/scheduling_timer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulingTimerService {
  constructor(
    @InjectRepository(SchedulingTimer)
    private readonly scheduling_timerRepository: Repository<SchedulingTimer>,
  ) {}

  find(id: number) {
    return this.scheduling_timerRepository.find({ where: { store_id: id } });
  }

  findOne(id: number) {
    return this.scheduling_timerRepository.findOne({ where: { id: id } });
  }

  async update(updateSchedulingTimerDto: UpdateSchedulingTimerDto) {
    let data = await this.findOne(updateSchedulingTimerDto['id']);
    data = {
      ...data,
      ...updateSchedulingTimerDto,
      id: data.id,
    };
    return this.scheduling_timerRepository.save(data);
  }

  remove(id: number) {
    return `This action removes a #${id} schedulingTimer`;
  }
}
