import styles from './PostList.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import likeFetch from '../../fetch/likeFetch';
import Comment from './Comment';

function Post(props) {
  const { profile, author, text_content, likes, comments, _id } = props;
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onLike = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(_id);

    const { result, error } = await likeFetch(_id);

    if (error?.code) {
      setServerError(true);
    }

    if (result?.createdLike) {
      console.log('liked');
    }

    setLoading(false);
  };

  if (loading) {
    return <div className={styles.App}>Loading...</div>;
  }

  if (serverError) {
    return <div className={styles.App}>Server Error</div>;
  }

  return (
    <div className={styles.PostList} style={{ border: '2px solid orange' }}>
      <Link to={`/${profile}`}>{author}</Link>
      <br></br>
      {text_content}
      <br></br>
      <button onClick={onLike}>Like</button>
      <br></br>
      {likes ? likes?.length : 0} Likes
      <br></br>
      {'Comments: '}
      <br></br>
      {comments
        ? comments.map((comment) => <Comment key={comment._id} {...comment} />)
        : null}
    </div>
  );
}

Post.propTypes = {
  profile: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  text_content: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(PropTypes.object).isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  _id: PropTypes.string.isRequired,
};

export default Post;
