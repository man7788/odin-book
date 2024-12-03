import styles from './Avatar.module.css';
import PropTypes from 'prop-types';
import CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import useProfile from '../../hooks/useProfile';

const Avatar = ({ profileId, type }) => {
  const { profileResult, profileLoading, profileError } = useProfile(profileId);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const regex = /github/;
    const github = regex.test(profileResult?.profile.avatar);

    if (github) {
      setAvatarUrl(profileResult?.profile.avatar);
    } else {
      const hashedEmail = CryptoJS.SHA256(profileResult?.profile.avatar);
      const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}?d=mp`;
      setAvatarUrl(gravatarUrl);
    }
  }, [profileResult]);

  if (profileLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles[`${type}Placeholder`]}></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className={styles.Avatar}>
        <div className={styles[`${type}Placeholder`]}></div>
      </div>
    );
  }

  return (
    <div className={styles.Avatar}>
      <img className={styles[`${type}Image`]} src={avatarUrl}></img>
    </div>
  );
};

Avatar.propTypes = {
  profileId: PropTypes.string,
  type: PropTypes.string,
};

export default Avatar;
