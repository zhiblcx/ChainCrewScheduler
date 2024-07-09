import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingRuleService } from './scheduling_rule.service';

describe('SchedulingRuleService', () => {
  let service: SchedulingRuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulingRuleService],
    }).compile();

    service = module.get<SchedulingRuleService>(SchedulingRuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
