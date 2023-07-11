import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationType } from '~/packages/notification/libs/enums/notification-type.enum.js';
import { notification } from '~/packages/notification/notification.js';

import { ActionType } from './common.js';

const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { getState, rejectWithValue, extra: { services } }) => {
    try {
      const {
        posts: { count }
      } = getState();

      const posts = await services.post.getAllPosts({
        from: 0,
        count,
        ...filters
      });
      return { posts };
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, rejectWithValue, extra: { services } }) => {
    try {
      const {
        posts: { posts, from, count }
      } = getState();
      const loadedPosts = await services.post.getAllPosts({
        from,
        count,
        ...filters
      });
      const filteredPosts = loadedPosts.filter(
        post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
      );

      return { posts: filteredPosts };
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const applyPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (
    { id: postId, userId },
    { getState, rejectWithValue, extra: { services } }
  ) => {
    try {
      const {
        profile: { user }
      } = getState();
      if (userId === user.id) {
        return { post: null };
      }

      const post = await services.post.getPost(postId);
      return { post };
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const createPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (post, { rejectWithValue, extra: { services } }) => {
    try {
      const { id } = await services.post.addPost(post);
      const newPost = await services.post.getPost(id);

      return { post: newPost };
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const deletePost = createAsyncThunk(
  ActionType.DELETE_POST,
  async (id, { getState, rejectWithValue, extra: { services } }) => {
    try {
      await services.post.deletePost(id);
      const {
        posts: { posts }
      } = getState();
      const updated = posts.filter(post => post.id !== id);

      return { posts: updated };
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const reactPostSocket = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const updatePost = await services.post.getPost(postId);

    const {
      posts: { posts }
    } = getState();
    const updated = posts.map(post => (post.id === postId ? updatePost : post));

    return { posts: updated };
  }
);

const showChange = (getState, change, postId) => {
  const mapChange = post => ({
    ...post,
    ...change
  });

  const {
    posts: { posts, expandedPost }
  } = getState();
  const updated = posts.map(post =>
    post.id === postId ? mapChange(post) : post
  );
  const updatedExpandedPost =
    expandedPost?.id === postId ? mapChange(expandedPost) : undefined;

  return { posts: updated, expandedPost: updatedExpandedPost };
};

const updatePost = createAsyncThunk(
  ActionType.UPDATE_POST,
  async (post, { getState, rejectWithValue, extra: { services } }) => {
    try {
      const updatedPost = await services.post.updatePost(post);
      return showChange(getState, updatedPost, post.id);
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const likePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, rejectWithValue, extra: { services } }) => {
    try {
      const countReaction = await services.post.likePost(postId);
      return showChange(getState, countReaction, postId);
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const dislikePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, rejectWithValue, extra: { services } }) => {
    try {
      const countReaction = await services.post.dislikePost(postId);
      return showChange(getState, countReaction, postId);
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const addComment = createAsyncThunk(
  ActionType.COMMENT,
  async (request, { getState, rejectWithValue, extra: { services } }) => {
    try {
      const { id } = await services.comment.addComment(request);
      const comment = await services.comment.getComment(id);

      const mapComments = post => ({
        ...post,
        commentCount: Number(post.commentCount) + 1,
        comments: [...(post.comments || []), comment] // comment is taken from the current closure
      });

      const {
        posts: { posts, expandedPost }
      } = getState();
      const updated = posts.map(post =>
        post.id === comment.postId ? mapComments(post) : post
      );

      const updatedExpandedPost =
        expandedPost?.id === comment.postId
          ? mapComments(expandedPost)
          : undefined;

      return { posts: updated, expandedPost: updatedExpandedPost };
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

export {
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
};
