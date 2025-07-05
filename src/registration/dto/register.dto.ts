import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export default class RegisterDto {
  @MaxLength(50, { message: 'name_too_long' })
  @IsString({ message: 'name_invalid' })
  @IsNotEmpty({ message: 'name_required' })
  name: string;

  @MaxLength(70, { message: 'city_too_long' })
  @IsString({ message: 'city_invalid' })
  @IsNotEmpty({ message: 'city_required' })
  city: string;

  @Matches(/^05\d{8}$/, { message: 'phone_invalid' })
  @IsNotEmpty({ message: 'phone_required' })
  phone: string;

  @Matches(/^[0-9A-F]{10}$/, { message: 'code_invalid' })
  @IsNotEmpty({ message: 'code_required' })
  code;
}
