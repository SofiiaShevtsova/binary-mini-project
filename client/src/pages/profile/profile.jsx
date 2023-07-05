import { Button } from '~/libs/components/button/button.jsx';
import { IconButton } from '~/libs/components/icon-button/icon-button.jsx';
import { Image } from '~/libs/components/image/image.jsx';
import { Input } from '~/libs/components/input/input.jsx';
import {
  ButtonColor,
  ButtonType,
  IconName,
  ImageSize
} from '~/libs/enums/enums.js';
import {
  useAppForm,
  useCallback,
  useDispatch,
  useSelector,
  useState
} from '~/libs/hooks/hooks.js';
import { image as imageService } from '~/packages/image/image.js';
import { DEFAULT_USER_AVATAR } from '~/packages/user/constants/constants.js';
import { actions as profileActionCreator } from '~/slices/profile/profile.js';

import styles from './styles.module.scss';

const handleUploadImage = file => imageService.uploadImage(file);

const Profile = () => {
  const dispatch = useDispatch();
  const [updateProfile, setUpdateProfile] = useState(true);
  const { user } = useSelector(state => ({
    user: state.profile.user
  }));
  const [image, setImage] = useState(user.image);

  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: {
      username: user.username,
      email: user.email
    }
  });

  const handleUpdateProfileToggle = useCallback(
    () =>
      setUpdateProfile(previus => {
        if (!previus) {
          reset();
        }
        return !previus;
      }),
    [reset]
  );

  const handleCloseUpdateProfile = useCallback(() => {
    reset();
    setUpdateProfile(true);
  }, [reset]);

  const handleUpdateProfile = useCallback(
    values => {
      if (values.username === user.username && user.imageId === image.id) {
        return;
      }
      dispatch(
        profileActionCreator.update({
          imageId: image?.id,
          username: values.username,
          id: user.id
        })
      ).then(() => {
        reset();
      });
    },
    [user, image, dispatch, reset]
  );

  const handleUploadFile = useCallback(({ target }) => {
    const [file] = target.files;

    handleUploadImage(file)
      .then(({ id, link }) => {
        setImage({ id, link });
      })
      .catch(() => {
        // TODO: show error
      });
  }, []);

  return (
    <>
      <div className={styles.btnEditBox}>
        <IconButton
          iconName={IconName.EDIT}
          onClick={handleUpdateProfileToggle}
        />
      </div>
      <form
        name="profile"
        className={styles.profile}
        onSubmit={handleSubmit(handleUpdateProfile)}
      >
        <Image
          alt="profile avatar"
          isCentered
          src={image?.link ?? DEFAULT_USER_AVATAR}
          size={ImageSize.MEDIUM}
          isCircular
        />
        {!updateProfile && (
          <Button color="teal">
            <label className={styles.btnImgLabel}>
              Change avatar
              <input
                name="image"
                type="file"
                onChange={handleUploadFile}
                hidden
              />
            </label>
          </Button>
        )}
        <fieldset className={styles.fieldset}>
          <Input
            iconName={IconName.USER}
            placeholder="Username"
            name="username"
            value={user.username}
            control={control}
            disabled={updateProfile}
          />
          <Input
            iconName={IconName.AT}
            placeholder="Email"
            name="email"
            type="email"
            value={user.email}
            control={control}
            disabled
          />
        </fieldset>
        {!updateProfile && (
          <div className={styles.btnForm}>
            <Button
              color={ButtonColor.TEAL}
              type={ButtonType.BUTTON}
              onClick={handleCloseUpdateProfile}
            >
              Cancel
            </Button>
            <Button color={ButtonColor.BLUE} type={ButtonType.SUBMIT}>
              Update
            </Button>
          </div>
        )}
      </form>
    </>
  );
};

export { Profile };
