import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { CommonService } from './common.service';
import { Public } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { UserTokenInterface } from 'src/common/interfaces/user-token.interface';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('countries')
  @Public()
  @ApiTags('Common')
  @ApiOperation({ summary: 'Retrieve all countries created in database' })
  @ApiQuery({
    name: 'country_name',
    description: 'Country name',
    required: false,
  })
  getCountries(
    @Query('country_name') country_name: string
  ) {
    return this.commonService.getCountries(country_name);
  }

  @Get('sports')
  @Public()
  @ApiTags('Common')
  @ApiOperation({ summary: 'Retrieve all sports created in database' })
  getSports() {
    return this.commonService.getSports();
  }
}
