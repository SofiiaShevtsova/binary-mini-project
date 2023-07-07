/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';

import { IconName } from '~/libs/enums/enums.js';
import { getFromNowTime } from '~/libs/helpers/helpers.js';
import { useCallback, useDispatch } from '~/libs/hooks/hooks.js';
import { postType } from '~/libs/prop-types/property-types.js';
import { actions as threadActionCreator } from '~/slices/thread/thread.js';

import { IconButton } from '../icon-button/icon-button.jsx';
import { Image } from '../image/image.jsx';
import { Tooltip } from '../tooltip-for-reaction/tooltip-for-reaction.jsx';
import styles from './styles.module.scss';

const Post = ({
  post,
  userId,
  onPostLike,
  onPostDislike,
  onExpandedPostToggle,
  onSharePost,
  onUpdatePostToggle
}) => {
  const dispatch = useDispatch();

  const {
    id,
    image,
    body,
    user,
    likeCount,
    dislikeCount,
    commentCount,
    createdAt
  } = post;

  const date = getFromNowTime(createdAt);

  const handlePostLike = useCallback(() => onPostLike(id), [id, onPostLike]);

  const handlePostDislike = useCallback(
    () => onPostDislike(id),
    [id, onPostDislike]
  );
  const handleExpandedPostToggle = useCallback(
    () => onExpandedPostToggle(id),
    [id, onExpandedPostToggle]
  );

  const handleUpdatePostToggle = useCallback(
    () => onUpdatePostToggle(post),
    [post, onUpdatePostToggle]
  );

  const handleSharePost = useCallback(() => onSharePost(id), [id, onSharePost]);

  const handleDeletePost = useCallback(
    () => dispatch(threadActionCreator.deletePost(id)),
    [dispatch, id]
  );

  return (
    <div className={styles.card}>
      {user.id === userId && (
        <div className={styles.userPost}>
          <IconButton
            iconName={IconName.EDIT}
            onClick={handleUpdatePostToggle}
          />
          <IconButton iconName={IconName.DELETE} onClick={handleDeletePost} />
        </div>
      )}

      {image && <Image src={image.link} alt="post image" />}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span>{`posted by ${user.username} - ${date}`}</span>
        </div>
        <p className={styles.description}>{body}</p>
      </div>
      <div className={styles.extra}>
        <Tooltip
          button={
            <IconButton
              iconName={IconName.THUMBS_UP}
              label={likeCount}
              onClick={handlePostLike}
            />
          }
          list={[{ id: 2, username: 'Nick' }]}
        />
        <Tooltip
          button={
            <IconButton
              iconName={IconName.THUMBS_DOWN}
              label={dislikeCount}
              onClick={handlePostDislike}
            />
          }
          list={[{ id: 2, username: 'Nick' }]}
        />
        <IconButton
          iconName={IconName.COMMENT}
          label={commentCount}
          onClick={handleExpandedPostToggle}
        />
        <IconButton
          iconName={IconName.SHARE_ALTERNATE}
          onClick={handleSharePost}
        />
      </div>
    </div>
  );
};

Post.propTypes = {
  post: postType.isRequired,
  userId: PropTypes.number.isRequired,
  onPostLike: PropTypes.func.isRequired,
  onPostDislike: PropTypes.func.isRequired,
  onExpandedPostToggle: PropTypes.func.isRequired,
  onSharePost: PropTypes.func.isRequired,
  onUpdatePostToggle: PropTypes.func.isRequired
};

export { Post };
