import styles from './ErrorPage.module.css';
import { Link } from 'react-router-dom';
import App from './App';
import useAuth from './hooks/useAuth';

const ErrorPage = () => {
  const { authResult, authLoading, authError } = useAuth();

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (authResult) {
    return <App errorRedirect={true} />;
  }

  return (
    <>
      {authError && (
        <div className={styles.error}>
          <h1>Oh no, this page doesn&apos;t exist!</h1>
          <Link to="/">
            You can go back to the home page by clicking here, though!
          </Link>
        </div>
      )}
    </>
  );
};

export default ErrorPage;
