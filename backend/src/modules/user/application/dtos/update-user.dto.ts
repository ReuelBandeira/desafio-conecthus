import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import {
  PASSWORD_INVALID_MESSAGE,
  PASSWORD_REGEX,
} from '../../domain/value-objects/password.vo';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends CreateUserDto {
  // Set by the controller from the :id route param, never from the request
  // body — hidden from Swagger and left undecorated so whitelist:true would
  // strip it if a client tried to send it anyway.
  @ApiHideProperty()
  id: string;

  @ApiPropertyOptional({
    example: 'Ab1c2d',
    description:
      '6 caracteres alfanuméricos. Deixe vazio para manter a senha atual.',
  })
  @IsOptional()
  @Matches(PASSWORD_REGEX, { message: PASSWORD_INVALID_MESSAGE })
  declare password: string;
}
