import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Make sure this file has username instead of fullname
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  fullname: string;

  @IsString()
  @MinLength(8)
  password: string;
}