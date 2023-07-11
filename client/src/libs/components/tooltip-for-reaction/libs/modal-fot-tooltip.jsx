import PropTypes from 'prop-types';

import { Image } from '~/libs/components/image/image.jsx';
import { Modal } from '~/libs/components/modal/modal.jsx';
import { DEFAULT_USER_AVATAR } from '~/packages/user/constants/user.constants.js';

import styles from '../styles.module.scss';

const ModalForTooltip = ({ list, onClose }) => {
  return (
    <Modal isOpen isCentered onClose={onClose}>
      <ul className={styles.modalListUser}>
        {list.map(({ user }) => (
          <li key={user.id} className={styles.modalUserWrapper}>
            <Image
              isCircular
              src={user.image?.link ?? DEFAULT_USER_AVATAR}
              alt="user avatar"
            />
            <p>{user.username}</p>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

ModalForTooltip.propTypes = {
  list: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

export { ModalForTooltip };
