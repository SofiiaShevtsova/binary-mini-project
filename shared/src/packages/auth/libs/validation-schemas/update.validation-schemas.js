import Joi from 'joi';

import {
  UserPayloadKey,
  UserValidationMessage,
  UserValidationRule
} from '../../../user/user.js';

const update = Joi.object({
  [UserPayloadKey.USERNAME]: Joi.string()
    .trim()
    .min(UserValidationRule.USERNAME_MIN_LENGTH)
    .max(UserValidationRule.USERNAME_MAX_LENGTH)
    .messages({
      'string.empty': UserValidationMessage.USERNAME_REQUIRE,
      'string.min': UserValidationMessage.USERNAME_MIN_LENGTH,
      'string.max': UserValidationMessage.USERNAME_MAX_LENGTH
    }),
  [UserPayloadKey.IMAGE]: Joi.any()
});

export { update };
