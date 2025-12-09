import { PickType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { RegisterAuthDto } from './register-auth.dto';
import { Role } from 'src/constants/role.enum';

export class PayloadAuthDto extends PickType(RegisterAuthDto, [
  'name',
  'email',
]) {
  @IsNotEmpty()
  @IsNumber()
  sub: number;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
