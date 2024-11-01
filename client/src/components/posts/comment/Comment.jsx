import styles from './Comment.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Comment(props) {
  const { author, text_content, profile } = props;

  return (
    <div className={styles.Comment}>
      <Link to={`/${profile}`}>{author}</Link>
      <br></br>
      {text_content}
    </div>
  );
}

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  text_content: PropTypes.string.isRequired,
  profile: PropTypes.string.isRequired,
};

export default Comment;
