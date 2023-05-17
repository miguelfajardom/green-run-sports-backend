import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Bet } from './entities/bet.entity';
import { PlaceBetDto } from '../user_bets/dto/place-bet.dto';
import { MessageResponse } from 'src/utils/message-response.enum';

@Injectable()
export class BetsService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Bet) private betRepository: Repository<Bet>,
  ) {}

  
  async listBets(event_id: number, sport_id: number): Promise<any> {
    try {
      const queryBuilder = this.betRepository
        .createQueryBuilder('bet');
  
      if (sport_id) {
        queryBuilder.andWhere('bet.sport_id = :sport_id', { sport_id });
      }
  
      if (event_id) {
        queryBuilder.andWhere('bet.event_id = :event_id', { event_id });
      }  

      const filteredData = await queryBuilder.getMany()

      if(filteredData.length !== 0){
        return {status: HttpStatus.OK, count: filteredData.length, items: filteredData}
      }

      return {status: HttpStatus.NOT_FOUND, message: MessageResponse.NO_RECORDS_FOUND}

    } catch (error) {
      throw new HttpException(
        { error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBet(id: number, updateBetDto: UpdateBetDto): Promise<any>{
    try {
      const betToUpdate = await this.betRepository.findOneBy({id})
      if(!betToUpdate){
        throw new HttpException('No record found with the specified parameters', HttpStatus.NOT_FOUND)
      }

      betToUpdate.status = updateBetDto.status
      await this.betRepository.save(betToUpdate)

      return {status: HttpStatus.OK, message: 'Record update successfully'}
      
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST)
    }
  }
  

  async placeBet(placeBetDto: PlaceBetDto): Promise<any>{

  }
}
