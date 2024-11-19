import styles from './Avatar.module.css';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';

const Avatar = ({ email }) => {
  const hashedEmail = CryptoJS.SHA256(email);
  const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}?d=mp`;

  return (
    <div className={styles.Avatar}>
      <img src={gravatarUrl}></img>
    </div>
  );
};

Avatar.propTypes = {
  email: PropTypes.string,
};

export default Avatar;
