import styles from './PostList.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Comment from './Comment';

function Post(props) {
  const { profile, author, text_content, likes, comments } = props;

  return (
    <div className={styles.PostList} style={{ border: '2px solid orange' }}>
      <Link to={`/${profile}`}>{author}</Link>
      <br></br>
      {text_content}
      <br></br>
      {'Likes: '}
      {likes ? likes?.length : 0}
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
};

export default Post;
