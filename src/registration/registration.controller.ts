import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { RegistrationService } from './registration.service';
import { PaginationDto } from './dto/pagination.dto';
import { AddCodeDto } from './dto/add-code.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async register(@Body() body: RegisterDto) {
    return this.registrationService.register(body);
  }

  @Get()
  async findRegistrations(@Query() pagination: PaginationDto) {
    return this.registrationService.findRegistrations(pagination);
  }

  @Post('add-code')
  async addCode(@Body() dto: AddCodeDto) {
    return this.registrationService.addCode(dto);
  }
}
