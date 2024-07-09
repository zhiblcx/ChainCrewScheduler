import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingRuleController } from './scheduling_rule.controller';
import { SchedulingRuleService } from './scheduling_rule.service';

describe('SchedulingRuleController', () => {
  let controller: SchedulingRuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingRuleController],
      providers: [SchedulingRuleService],
    }).compile();

    controller = module.get<SchedulingRuleController>(SchedulingRuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
