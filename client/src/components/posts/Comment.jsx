import styles from './Comment.module.css';
import PropTypes from 'prop-types';

function Comment(props) {
  const { author, text_content } = props;

  return (
    <div className={styles.Comment} style={{ border: '2px solid cyan' }}>
      {author}
      <br></br>
      {text_content}
    </div>
  );
}

Comment.propTypes = {
  author: PropTypes.string.isRequired,
  text_content: PropTypes.string.isRequired,
};

export default Comment;
