import { Test, TestingModule } from '@nestjs/testing';
import { PassengerFlowService } from './passenger_flow.service';

describe('PassengerFlowService', () => {
  let service: PassengerFlowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassengerFlowService],
    }).compile();

    service = module.get<PassengerFlowService>(PassengerFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
