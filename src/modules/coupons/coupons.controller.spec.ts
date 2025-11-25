/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

describe('CouponsController', () => {
  let controller: CouponsController;
  let service: CouponsService;

  const mockService = {
    create: jest.fn(),
    findByCode: jest.fn(),
    generateNthOrderCoupon: jest.fn(),
    incrementOrderCount: jest.fn(),
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
    it('should call service', async () => {
      await controller.requestNthCoupon();
      expect(service.generateNthOrderCoupon).toHaveBeenCalled();
    });
  });
});
