import {
  Controller,
  ControllerHook
} from '#libs/packages/controller/controller.js';
import { HttpCode, HttpMethod } from '#libs/packages/http/http.js';

import { UsersApiPath } from './libs/enums/enums.js';
import { updateValidationSchema } from './libs/validation-schemas/validation-schemas.js';

class UserController extends Controller {
  #userService;

  constructor({ apiPath, userService }) {
    super({ apiPath });
    this.#userService = userService;

    this.addRoute({
      method: HttpMethod.PUT,
      url: UsersApiPath.$ID,
      schema: {
        body: updateValidationSchema
      },
      [ControllerHook.HANDLER]: this.update
    });
  }

  update = async (request, reply) => {
    try {
      if (request.user.id !== +request.params.id) {
        return reply.status(HttpCode.FORBIDDEN).send('Not your profile!');
      }
      const updatedUser = await this.#userService.updateUser(
        request.user.id,
        request.body
      );
      return updatedUser && this.#userService.getUserById(request.user.id);
    } catch (error) {
      return reply.status(HttpCode.BAD_REQUEST).send(error.message);
    }
  };
}

export { UserController };
