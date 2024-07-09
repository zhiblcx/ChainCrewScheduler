import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingTimerService } from './scheduling_timer.service';

describe('SchedulingTimerService', () => {
  let service: SchedulingTimerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulingTimerService],
    }).compile();

    service = module.get<SchedulingTimerService>(SchedulingTimerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
