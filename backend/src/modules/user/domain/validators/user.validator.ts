import ValidatorInterface from '@/core/domain/validator/validator.interface';
import { UserEntity } from '@/modules/user/domain/entities/user.entity';
import {
  NAME_INVALID_MESSAGE,
  NAME_REGEX,
} from '@/modules/user/domain/value-objects/name.vo';
import {
  REGISTRATION_INVALID_MESSAGE,
  REGISTRATION_REGEX,
} from '@/modules/user/domain/value-objects/registration.vo';
import Joi from 'joi';

export class UserJoiValidator implements ValidatorInterface<UserEntity> {
  validate(entity: UserEntity): void {
    const schema = this.getSchema();

    const data = {
      id: entity.id,
      name: entity.name,
      registration: entity.registration,
      email: entity.email,
      password: entity.password,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    const { error } = schema.validate(data, {
      abortEarly: false,
      allowUnknown: true,
    });

    // Errors are collected on the entity's own Notification instance rather
    // than thrown here, so the entity's constructor is the single place
    // that decides when validation failure becomes an exception.
    error?.details.forEach((detail) => {
      entity.notification.addError({
        context: 'user',
        message: detail.message,
      });
    });
  }

  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(NAME_REGEX)
        .required()
        .messages({
          'any.required': 'O nome é obrigatório.',
          'string.empty': 'O nome não pode ser vazio.',
          'string.min': 'O nome deve ter no mínimo 2 caracteres.',
          'string.max': 'O nome não pode exceder 100 caracteres.',
          'string.base': 'O nome deve ser um texto.',
          'string.pattern.base': NAME_INVALID_MESSAGE,
        }),

      registration: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(REGISTRATION_REGEX)
        .required()
        .messages({
          'any.required': 'A matrícula é obrigatória.',
          'string.empty': 'A matrícula não pode ser vazia.',
          'string.min': 'A matrícula deve ter no mínimo 2 caracteres.',
          'string.max': 'A matrícula não pode exceder 50 caracteres.',
          'string.base': 'A matrícula deve ser um texto.',
          'string.pattern.base': REGISTRATION_INVALID_MESSAGE,
        }),

      email: Joi.string().trim().email().required().messages({
        'any.required': 'O e-mail é obrigatório.',
        'string.empty': 'O e-mail não pode ser vazio.',
        'string.email': 'Informe um e-mail válido.',
        'string.base': 'O e-mail deve ser um texto.',
      }),

      // Holds the bcrypt hash by the time the entity is persisted, not the
      // plaintext password — plaintext shape is enforced at the DTO layer,
      // before hashing (see CreateUserDto/UpdateUserDto).
      password: Joi.string().min(1).required().messages({
        'any.required': 'A senha é obrigatória.',
        'string.empty': 'A senha não pode ser vazia.',
        'string.base': 'A senha deve ser um texto.',
      }),

      isActive: Joi.boolean().required().messages({
        'any.required': 'isActive é obrigatório.',
      }),
    });
  }
}
