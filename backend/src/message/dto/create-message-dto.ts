import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}