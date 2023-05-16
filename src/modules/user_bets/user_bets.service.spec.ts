import { Test, TestingModule } from '@nestjs/testing';
import { UserBetsService } from './user_bets.service';

describe('UserBetsService', () => {
  let service: UserBetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserBetsService],
    }).compile();

    service = module.get<UserBetsService>(UserBetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
