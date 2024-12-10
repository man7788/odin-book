import styles from './Post.module.css';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CommentList from './comment/CommentList';
import Like from './like/Like';
import useSinglePost from '../../hooks/useSinglePost';
import Avatar from '../avatar/Avatar';

function Post(props) {
  const { _id } = props;
  const { postResult, postLoading, postError, setRenderPost } =
    useSinglePost(_id);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (postResult) {
      setPost(postResult.post[0]);
    }
  }, [postResult]);

  if (postLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loaderContainer}>
          <div className={styles.loader}></div>
        </div>
      </div>
    );
  }

  if (postError) {
    return <div className={styles.error}>Server error</div>;
  }

  return (
    <>
      {post && (
        <div className={styles.Post}>
          <div className={styles.profile}>
            <Avatar profileId={post?.profile} type={'sidebar'} />
            <Link className={styles.fullName} to={`/${post.profile}`}>
              {post.author}
            </Link>
          </div>
          {post.text_content}
          <Like postId={_id} likes={post.likes} />
          <CommentList
            postId={_id}
            comments={post.comments}
            setRenderPost={setRenderPost}
          />
        </div>
      )}
    </>
  );
}

Post.propTypes = {
  _id: PropTypes.string.isRequired,
};

export default Post;
