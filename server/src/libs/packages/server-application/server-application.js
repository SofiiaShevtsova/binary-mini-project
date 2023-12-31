import qs from 'qs';

import { config } from '#libs/packages/config/config.js';
import { database } from '#libs/packages/database/database.js';
import { authController } from '#packages/auth/auth.js';
import { commentController } from '#packages/comment/comment.js';
import { imageController } from '#packages/image/image.js';
import { postController } from '#packages/post/post.js';
import { userController } from '#packages/user/user.js';

import { ServerApp } from './server-app.js';
import { ServerAppApi } from './server-app-api.js';

const serverAppApi = new ServerAppApi({
  controllers: [
    authController,
    commentController,
    imageController,
    postController,
    userController
  ]
});

const serverApp = new ServerApp({
  config,
  options: {
    ignoreTrailingSlash: true,
    logger: {
      transport: {
        target: 'pino-pretty'
      }
    },
    querystringParser: string => qs.parse(string, { comma: true })
  },
  database,
  api: serverAppApi
});

export { serverApp, serverAppApi };
export { ExitCode } from './libs/enums/enums.js';
export { ServerApp } from './server-app.js';
