import PropTypes from 'prop-types';

import { commentType } from '~/libs/prop-types/comment.js';
import { imageType } from '~/libs/prop-types/image.js';

const postType = PropTypes.exact({
  id: PropTypes.number.isRequired,
  body: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  deletedAt: PropTypes.string,
  image: imageType,
  imageId: PropTypes.number,
  likes: PropTypes.array.isRequired,
  dislikes: PropTypes.array.isRequired,
  commentCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  comments: PropTypes.arrayOf(commentType),
  userId: PropTypes.number.isRequired,
  user: PropTypes.exact({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    imageId: PropTypes.number,
    image: imageType
  }).isRequired
});

export { postType };
