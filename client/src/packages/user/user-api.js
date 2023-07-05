import { ApiPath, ContentType } from '~/libs/enums/enums.js';
import { HttpMethod } from '~/packages/http/libs/enums/enums.js';

import { UsersApiPath } from './enums/enums.js';

class Users {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  update(payload) {
    return this._http.load(
      `${this._apiPath}${ApiPath.USERS}${UsersApiPath.ROOT}${payload.id}`,
      {
        method: HttpMethod.PUT,
        contentType: ContentType.JSON,
        payload: JSON.stringify(payload)
      }
    );
  }
}

export { Users };
