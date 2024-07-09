import { Injectable } from '@nestjs/common';
import { UpdateSchedulingRuleDto } from './dto/update-scheduling_rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulingRule } from './entities/scheduling_rule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulingRuleService {
  constructor(
    @InjectRepository(SchedulingRule)
    private readonly scheduling_ruleRepository: Repository<SchedulingRule>,
  ) {}

  findAll() {
    return this.scheduling_ruleRepository.find();
  }

  findOne(id: number) {
    return this.scheduling_ruleRepository.findOne({ where: { store_id: id } });
  }

  async update(id: number, updateSchedulingRuleDto: UpdateSchedulingRuleDto) {
    let rule = await this.findOne(id);
    rule = { ...rule, ...updateSchedulingRuleDto };
    return this.scheduling_ruleRepository.save(rule);
  }
}
