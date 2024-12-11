import styles from './Like.module.css';
import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import likeFetch from '../../../fetch/likeFetch';

function Like({ postId, likes }) {
  const { profile } = useOutletContext();
  const [localLikes, setLocalLikes] = useState(likes.length);
  const [liked, setLiked] = useState(false);
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    const likeList = [];
    likes.forEach((like) => {
      likeList.push(like.profile);
    });

    if (likeList.includes(profile)) {
      setLiked(true);
    }
  }, [likes, profile]);

  const onLike = async (e) => {
    e.preventDefault();

    const { result, error } = await likeFetch(postId);

    if (error) {
      setServerError(true);
    }

    if (result?.createdLike) {
      setLiked(true);
      setLocalLikes(localLikes + 1);
    }

    if (result?.removedLike) {
      setLiked(false);
      if (localLikes > 1) {
        setLocalLikes(localLikes - 1);
      } else {
        setLocalLikes(0);
      }
    }
  };

  if (serverError) {
    return <div className={styles.Like}>Server Error</div>;
  }

  return (
    <div className={styles.Like}>
      {localLikes} <span> </span>
      <button onClick={onLike}>{!liked ? 'Like' : 'Unlike'}</button>
    </div>
  );
}

Like.propTypes = {
  postId: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Like;
