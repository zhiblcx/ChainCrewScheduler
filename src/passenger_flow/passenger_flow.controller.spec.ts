import { Test, TestingModule } from '@nestjs/testing';
import { PassengerFlowController } from './passenger_flow.controller';
import { PassengerFlowService } from './passenger_flow.service';

describe('PassengerFlowController', () => {
  let controller: PassengerFlowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengerFlowController],
      providers: [PassengerFlowService],
    }).compile();

    controller = module.get<PassengerFlowController>(PassengerFlowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
