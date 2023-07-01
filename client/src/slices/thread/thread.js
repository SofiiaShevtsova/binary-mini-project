import {
  addComment,
  applyPost,
  createPost,
  dislikePost,
  likePost,
  loadMorePosts,
  loadPosts,
  reactPostSocker,
  toggleExpandedPost
} from './actions.js';
import { actions } from './thread.slice.js';

const allActions = {
  ...actions,
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  likePost,
  dislikePost,
  reactPostSocker,
  addComment
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
