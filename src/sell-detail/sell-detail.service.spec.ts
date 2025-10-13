import { Test, TestingModule } from '@nestjs/testing';
import { SellDetailService } from './sell-detail.service';

describe('SellDetailService', () => {
  let service: SellDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellDetailService],
    }).compile();

    service = module.get<SellDetailService>(SellDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
