import { Test, TestingModule } from '@nestjs/testing';
import { SellDetailController } from './sell-detail.controller';
import { SellDetailService } from './sell-detail.service';

describe('SellDetailController', () => {
  let controller: SellDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellDetailController],
      providers: [SellDetailService],
    }).compile();

    controller = module.get<SellDetailController>(SellDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
