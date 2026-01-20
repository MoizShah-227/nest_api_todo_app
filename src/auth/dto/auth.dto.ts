import { ApiProperty} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({example:"syedmoiz123@gmail.com"})
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example:"123"})
  password!: string;
}
