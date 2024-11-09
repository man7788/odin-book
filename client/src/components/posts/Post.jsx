import styles from './Post.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CommentList from './comment/CommentList';
import Like from './like/Like';
import useSinglePost from '../../hooks/useSinglePost';

function Post(props) {
  const { _id } = props;
  const { postResult, postLoading, postError } = useSinglePost(_id);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (postResult) {
      setPost(postResult.post[0]);
    }
  });

  if (postLoading) {
    return <div className={styles.Post}>Loading</div>;
  }

  if (postError) {
    return <div className={styles.Post}>Server error</div>;
  }

  return (
    <>
      {post && (
        <div className={styles.Post}>
          <Link className={styles.fullName} to={`/${post.profile}`}>
            {post.author}
          </Link>
          <br></br>
          {post.text_content}
          <Like postId={_id} likes={post.likes} />
          <CommentList postId={_id} comments={post.comments} />
        </div>
      )}
    </>
  );
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
};

export default Post;
