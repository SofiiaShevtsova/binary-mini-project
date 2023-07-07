import PropTypes from 'prop-types';

import { Image } from '~/libs/components/image/image.jsx';
import { DEFAULT_USER_AVATAR } from '~/packages/user/constants/user.constants.js';

import styles from './styles.module.scss';

const Tooltip = ({ button, list }) => {
  return (
    <>
      <div className={styles.tooltip}>
        {button}
        <div className={styles.tooltiptext}>
          <ul>
            {list.map(item => (
              <li key={item.id}>
                <div className={styles.userWrapper}>
                  <Image
                    isCircular
                    width="45"
                    height="45"
                    src={item.image?.link ?? DEFAULT_USER_AVATAR}
                    alt="user avatar"
                  />
                  {item.username}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

Tooltip.propTypes = {
  list: PropTypes.array.isRequired,
  button: PropTypes.element.isRequired
};

export { Tooltip };
