import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingStatusController } from './scheduling_status.controller';
import { SchedulingStatusService } from './scheduling_status.service';

describe('SchedulingStatusController', () => {
  let controller: SchedulingStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingStatusController],
      providers: [SchedulingStatusService],
    }).compile();

    controller = module.get<SchedulingStatusController>(SchedulingStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
