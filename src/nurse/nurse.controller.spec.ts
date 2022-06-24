import { Test, TestingModule } from '@nestjs/testing';
import { NurseController } from './nurse.controller';

describe('NurseController', () => {
  let controller: NurseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NurseController],
    }).compile();

    controller = module.get<NurseController>(NurseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
