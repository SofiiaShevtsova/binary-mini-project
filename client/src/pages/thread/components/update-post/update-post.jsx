import PropTypes from 'prop-types';

import { Button } from '~/libs/components/button/button.jsx';
import { Image } from '~/libs/components/image/image.jsx';
import { Input } from '~/libs/components/input/input.jsx';
import { Modal } from '~/libs/components/modal/modal.jsx';
import { ButtonColor, ButtonType, ImageSize } from '~/libs/enums/enums.js';
import { useAppForm, useCallback } from '~/libs/hooks/hooks.js';
import { postType } from '~/libs/prop-types/post.js';
import { PostPayloadKey } from '~/packages/post/libs/enums/enums.js';

import styles from './styles.module.scss';

const UpdatePost = ({ post, onUpdatePost, onUpdatePostToggle }) => {
  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: { [PostPayloadKey.BODY]: post.body }
  });

  const handleUpdatePostClose = useCallback(
    () => onUpdatePostToggle(),
    [onUpdatePostToggle]
  );

  const handleUpdatePost = useCallback(
    values => {
      if (values.body === post.body) {
        return;
      }
      onUpdatePost({ id: post.id, image: post.image, body: values.body }).then(
        () => {
          reset();
          handleUpdatePostClose();
        }
      );
    },
    [post, onUpdatePost, reset, handleUpdatePostClose]
  );

  return (
    <Modal isOpen isCentered onClose={handleUpdatePostClose}>
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        <Input
          name={PostPayloadKey.BODY}
          placeholder="What is the news?"
          rows={5}
          control={control}
        />
        {post.image?.link && (
          <div>
            <Image
              src={post.image?.link}
              alt="post image"
              size={ImageSize.SMALL}
            />
          </div>
        )}
        <div className={styles.btnWrapper}>
          <Button
            color={ButtonColor.TEAL}
            type={ButtonType.BUTTON}
            onClick={handleUpdatePostClose}
          >
            Cancel
          </Button>
          <Button color={ButtonColor.BLUE} type={ButtonType.SUBMIT}>
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};

UpdatePost.propTypes = {
  post: postType.isRequired,
  onUpdatePost: PropTypes.func.isRequired,
  onUpdatePostToggle: PropTypes.func.isRequired
};

export { UpdatePost };
