import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, Matches } from 'class-validator';
import {
  NAME_INVALID_MESSAGE,
  NAME_REGEX,
} from '../../domain/value-objects/name.vo';
import {
  PASSWORD_INVALID_MESSAGE,
  PASSWORD_REGEX,
} from '../../domain/value-objects/password.vo';
import {
  REGISTRATION_INVALID_MESSAGE,
  REGISTRATION_REGEX,
} from '../../domain/value-objects/registration.vo';

export class CreateUserDto {
  @ApiProperty({ example: 'Administrador' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @Matches(NAME_REGEX, { message: NAME_INVALID_MESSAGE })
  name: string;

  @ApiProperty({ example: '12345678' })
  @IsString({ message: 'A matrícula deve ser um texto.' })
  @Matches(REGISTRATION_REGEX, { message: REGISTRATION_INVALID_MESSAGE })
  registration: string;

  @ApiProperty({ example: 'admin@email.com' })
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty({ example: 'Ab1c2d', description: '6 caracteres alfanuméricos' })
  @IsString({ message: 'A senha deve ser um texto.' })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_INVALID_MESSAGE })
  password: string;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive: boolean;
}
