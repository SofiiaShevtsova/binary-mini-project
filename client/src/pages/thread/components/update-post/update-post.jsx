import PropTypes from 'prop-types';

import { Button } from '~/libs/components/button/button.jsx';
import { Image } from '~/libs/components/image/image.jsx';
import { Input } from '~/libs/components/input/input.jsx';
import { Modal } from '~/libs/components/modal/modal.jsx';
import { ButtonColor, ButtonType, ImageSize } from '~/libs/enums/enums.js';
import {
  useAppForm,
  useCallback,
  useDispatch,
  useState
} from '~/libs/hooks/hooks.js';
import { postType } from '~/libs/prop-types/post.js';
import { PostPayloadKey } from '~/packages/post/libs/enums/enums.js';
import { actions as threadActionCreator } from '~/slices/thread/thread.js';

import styles from './styles.module.scss';

const UpdatePost = ({ post, onUpdatePostToggle, onUploadImage }) => {
  const dispatch = useDispatch();

  const [image, setImage] = useState(post.image);
  const [isUploading, setIsUploading] = useState(false);

  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: { [PostPayloadKey.BODY]: post.body }
  });

  const handlePostUpdate = useCallback(
    postPayload => dispatch(threadActionCreator.updatePost(postPayload)),
    [dispatch]
  );

  const handleUpdatePostClose = useCallback(
    () => onUpdatePostToggle(),
    [onUpdatePostToggle]
  );

  const handleUpdatePost = useCallback(
    values => {
      if (values.body === post.body && image?.id === post.image?.id) {
        return;
      }
      handlePostUpdate({
        id: post.id,
        imageId: image?.id,
        body: values.body
      }).then(() => {
        reset();
        handleUpdatePostClose();
      });
    },
    [post, handlePostUpdate, image, reset, handleUpdatePostClose]
  );

  const handleUploadFile = useCallback(
    ({ target }) => {
      setIsUploading(true);
      const [file] = target.files;

      onUploadImage(file)
        .then(({ id, link }) => {
          setImage({ id, link });
        })
        .catch(() => {
          // TODO: show error
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
    [onUploadImage]
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
        {image?.link ? (
          <div>
            <Image src={image?.link} alt="post image" size={ImageSize.SMALL} />
          </div>
        ) : (
          <Button
            color={ButtonColor.TEAL}
            isLoading={isUploading}
            isDisabled={isUploading}
          >
            <label className={styles.btnImgLabel}>
              Attach image
              <input
                name="image"
                type="file"
                onChange={handleUploadFile}
                hidden
              />
            </label>
          </Button>
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
  onUpdatePostToggle: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired
};

export { UpdatePost };
