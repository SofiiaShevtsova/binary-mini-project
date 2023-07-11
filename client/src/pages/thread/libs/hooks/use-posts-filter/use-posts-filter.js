import { createReducer } from '@reduxjs/toolkit';
import { useCallback, useReducer } from 'react';

import { PostsFilterAction } from '~/libs/enums/enums.js';

const postsFilterInitialState = {
  userId: undefined,
  isLike: undefined
};

const postsFilterReducer = createReducer(postsFilterInitialState, builder => {
  builder.addCase(PostsFilterAction.TOGGLE_SHOW_OWN_POSTS, (state, action) => {
    state.userId = action.payload.userId;
    state.isLike = action.payload.isLike;
  });
  builder.addCase(
    PostsFilterAction.TOGGLE_SHOW_LIKED_BY_OWN_POST,
    (state, action) => {
      state.userId = action.payload.userId;
      state.isLike = action.payload.isLike;
    }
  );
});

const usePostsFilter = () => {
  const [postsFilter, dispatchPostsFilter] = useReducer(
    postsFilterReducer,
    postsFilterInitialState
  );

  const handleShownOwnPosts = useCallback(userId => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE_SHOW_OWN_POSTS,
      payload: {
        userId,
        isLike: undefined
      }
    });
  }, []);

  const handleShowLikedByOwnPost = useCallback(userId => {
    dispatchPostsFilter({
      type: PostsFilterAction.TOGGLE_SHOW_LIKED_BY_OWN_POST,
      payload: {
        userId,
        isLike: true
      }
    });
  }, []);

  return { postsFilter, handleShownOwnPosts, handleShowLikedByOwnPost };
};

export { usePostsFilter };
