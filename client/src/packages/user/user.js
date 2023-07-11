import { ENV } from '~/libs/enums/enums.js';
import { http } from '~/packages/http/http.js';

import { Users } from './user-api.js';

const users = new Users({
  apiPath: ENV.API_PATH,
  http
});

export { users };
