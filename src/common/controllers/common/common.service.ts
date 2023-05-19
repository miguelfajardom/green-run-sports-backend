import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/common/entities/country.entity';
import { Event } from 'src/common/entities/event.entity';
import { Sport } from 'src/common/entities/sport.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { validateUserStatus } from 'src/utils/user.utils';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(Country) private countryRepository: Repository<Country>,
        @InjectRepository(Sport) private sportRepository: Repository<Sport>,
        @InjectRepository(User) private userRepository: Repository<User>,
        ){

    }
    
    async getCountries(country_name: string = ''):Promise<any>{
        const countries = await this.countryRepository.createQueryBuilder('country')
        .where('country.name LIKE :country', {country: `%${country_name}%`})
        .getMany()
        // const countries = await this.countryRepository.findBy({id: !country_id ? null : country_id})
        return {countries}
    }

    async getSports():Promise<any>{
        const sports = await this.sportRepository.find()
        return {sports}
    }
}
