import PropTypes from 'prop-types';

import { Image } from '~/libs/components/image/image.jsx';
import { useCallback, useState } from '~/libs/hooks/hooks.js';
import { DEFAULT_USER_AVATAR } from '~/packages/user/constants/user.constants.js';

import { ModalForTooltip } from './libs/modal-fot-tooltip.jsx';
import styles from './styles.module.scss';

const Tooltip = ({ button, list }) => {
  const [showModal, setShowModal] = useState(false);
  const showListOfUser = list.length > 2 ? list.slice(0, 3) : list;

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      {showModal && <ModalForTooltip list={list} onClose={handleCloseModal} />}
      <div className={styles.tooltip}>
        {button}
        {list.length > 0 && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
          <div className={styles.tooltiptext} onClick={handleOpenModal}>
            <ul className={styles.listOfUser}>
              {showListOfUser.map(({ user }) => (
                <li key={user.id} className={styles.userWrapper}>
                  <Image
                    isCircular
                    src={user.image?.link ?? DEFAULT_USER_AVATAR}
                    alt="user avatar"
                  />
                  <p>{user.username}</p>
                </li>
              ))}
            </ul>
            {list.length > 3 && <p>... {list.length - 3} users</p>}
          </div>
        )}
      </div>
    </>
  );
};

Tooltip.propTypes = {
  list: PropTypes.array.isRequired,
  button: PropTypes.element.isRequired
};

export { Tooltip };
