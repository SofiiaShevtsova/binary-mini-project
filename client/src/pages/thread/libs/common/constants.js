import { ThreadToolbarKey } from '~/libs/enums/enums.js';

const DEFAULT_THREAD_TOOLBAR = {
  [ThreadToolbarKey.SHOW_OWN_POSTS]: false,
  [ThreadToolbarKey.SHOW_LIKED_BY_OWN_POST]: false
};

const POSTS_PER_PAGE = 10;

export { DEFAULT_THREAD_TOOLBAR, POSTS_PER_PAGE };
