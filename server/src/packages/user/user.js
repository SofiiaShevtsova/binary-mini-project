import { ApiPath } from '#libs/enums/enums.js';

import { UserController } from './user.controller.js';
import { UserModel } from './user.model.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

const userRepository = new UserRepository({
  userModel: UserModel
});
const userService = new UserService({
  userRepository
});

const userController = new UserController({
  apiPath: ApiPath.USERS,
  userService
});

export { userController, userRepository, userService };
export {
  UserPayloadKey,
  UsersApiPath,
  UserValidationMessage,
  UserValidationRule
} from './libs/enums/enums.js';
export { UserModel } from './user.model.js';
