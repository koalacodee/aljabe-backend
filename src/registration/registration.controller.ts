import { Body, Controller, Post } from '@nestjs/common';
import RegisterDto from './dto/register.dto';
import { RegistrationService } from './registration.service';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  async register(@Body() body: RegisterDto) {
    return this.registrationService.register(body);
  }
}
