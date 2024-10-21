import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import loginFetch from '../../fetch/loginFetch';

function Login() {
  const [navHome, setNavHome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [formError, setFromError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      setNavHome(true);
    }
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginPayload = { email, password };
    const { result, error } = await loginFetch(loginPayload);

    if (error?.errors) {
      setFromError(error.errors);
    }

    if (error?.code) {
      setServerError(true);
    }

    if (result?.token) {
      localStorage.setItem('token', JSON.stringify(result.token));
      setNavHome(true);
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
    <div className={styles.Login}>
      Login
      <div className={styles.formContainer}>
        <form action="" method="post" onSubmit={onSubmitForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className={styles.loginBtn}>
            <button className={styles.button} type="submit">
              Log In
            </button>
          </div>
        </form>
        {formError &&
          formError.map((error) => <div key={error.msg}>{error.msg}</div>)}
      </div>
      {navHome && <Navigate to="/" replace={true} />}
    </div>
  );
}

export default Login;
