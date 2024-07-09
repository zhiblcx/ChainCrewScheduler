import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingTimerController } from './scheduling_timer.controller';
import { SchedulingTimerService } from './scheduling_timer.service';

describe('SchedulingTimerController', () => {
  let controller: SchedulingTimerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingTimerController],
      providers: [SchedulingTimerService],
    }).compile();

    controller = module.get<SchedulingTimerController>(SchedulingTimerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
