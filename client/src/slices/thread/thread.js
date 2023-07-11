import {
  addComment,
  applyPost,
  createPost,
  deletePost,
  dislikePost,
  likePost,
  loadMorePosts,
  loadPosts,
  reactPostSocket,
  toggleExpandedPost,
  updatePost
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
  deletePost,
  dislikePost,
  reactPostSocket,
  addComment,
  updatePost
};

export { allActions as actions };
export { reducer } from './thread.slice.js';
