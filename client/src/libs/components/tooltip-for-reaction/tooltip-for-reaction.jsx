import PropTypes from 'prop-types';

import { Image } from '~/libs/components/image/image.jsx';
import { DEFAULT_USER_AVATAR } from '~/packages/user/constants/user.constants.js';

import styles from './styles.module.scss';

const Tooltip = ({ button, list }) => {
  const showListOfUser = list.length > 2 ? list.slice(0, 3) : list;
  return (
    <>
      <div className={styles.tooltip}>
        {button}
        {list.length > 0 && (
          <div className={styles.tooltiptext}>
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
