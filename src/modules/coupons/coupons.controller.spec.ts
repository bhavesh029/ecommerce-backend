/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { CheckEligibilityDto } from './dto/check-eligibility.dto';

describe('CouponsController', () => {
  let controller: CouponsController;
  let service: CouponsService;

  const mockService = {
    create: jest.fn(),
    findByCode: jest.fn(),
    generateNthOrderCoupon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponsController],
      providers: [{ provide: CouponsService, useValue: mockService }],
    }).compile();

    controller = module.get<CouponsController>(CouponsController);
    service = module.get<CouponsService>(CouponsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestNthCoupon', () => {
    it('should call service with userId', async () => {
      const dto: CheckEligibilityDto = { userId: 1 };

      await controller.requestNthCoupon(dto);

      expect(service.generateNthOrderCoupon).toHaveBeenCalledWith(1);
    });
  });
});
