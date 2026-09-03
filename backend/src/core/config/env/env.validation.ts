import Joi from 'joi';

export const envValidationSchema = Joi.object({
  BACKEND_PORT: Joi.number().default(4000),
  PORT: Joi.number().optional(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow('').required(),
  DB_DATABASE: Joi.string().required(),

  BCRYPT_ROUNDS: Joi.number().default(10),
}).unknown(true);
