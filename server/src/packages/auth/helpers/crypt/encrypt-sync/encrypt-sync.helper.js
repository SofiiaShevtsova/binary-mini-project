import { hashSync } from 'bcrypt';

import { USER_PASSWORD_SALT_ROUNDS } from '../libs/constants/constants.js';

const encryptSync = data => hashSync(data, USER_PASSWORD_SALT_ROUNDS);

export { encryptSync };
