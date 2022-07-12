import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends PartialType(SignInDto) {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;
}
