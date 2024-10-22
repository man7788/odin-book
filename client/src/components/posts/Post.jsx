import styles from './PostList.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CommentList from './comment/CommentList';
import Like from './like/Like';

function Post(props) {
  const { profile, author, text_content, likes, comments, _id } = props;

  return (
    <div className={styles.PostList} style={{ border: '2px solid orange' }}>
      <Link to={`/${profile}`}>{author}</Link>
      <br></br>
      {text_content}
      <Like postId={_id} likes={likes} />
      <CommentList postId={_id} comments={comments} />
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
