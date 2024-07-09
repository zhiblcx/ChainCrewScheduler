import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingStatusService } from './scheduling_status.service';

describe('SchedulingStatusService', () => {
  let service: SchedulingStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulingStatusService],
    }).compile();

    service = module.get<SchedulingStatusService>(SchedulingStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
