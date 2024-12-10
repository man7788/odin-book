import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import loginFetch from '../../../fetch/loginFetch';

function Login() {
  const { authResult, authLoading } = useAuth();

  const [navHome, setNavHome] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [formError, setFromError] = useState([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [formLoading, setFormLoading] = useState(false);
  const [loginActive, setLoginActive] = useState(false);

  useEffect(() => {
    if (authResult) {
      setNavHome(true);
    }
  }, [authResult]);

  useEffect(() => {
    for (const error of formError) {
      if (/email/i.test(error.msg)) {
        setEmailError(error.msg);
      } else if (/user/i.test(error.msg)) {
        setEmailError(error.msg);
      } else if (/password/i.test(error.msg)) {
        setPasswordError(error.msg);
      }
    }
  }, [formError]);

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setLoginActive(true);
    } else {
      setLoginActive(false);
    }
  }, [email, password]);

  useEffect(() => {
    setEmailError(null);
  }, [email]);

  useEffect(() => {
    setPasswordError(null);
  }, [password]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setEmailError('');
    setFormLoading(true);

    const loginPayload = { email, password };
    const { result, error } = await loginFetch(loginPayload);

    if (error?.errors) {
      setFormLoading(false);
      setFromError(error.errors);
      return;
    }

    if (error) {
      setServerError(true);
    }

    if (result) {
      localStorage.setItem('token', JSON.stringify(result.token));
      setNavHome(true);
    }
  };

  const onGithubLogin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const clientID = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectURI = 'http://localhost:5173/auth/github/callback';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&scope=user:email`;
  };

  if (serverError) {
    return <div className={styles.serverError}>Server Error</div>;
  }

  if (authLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (navHome) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className={styles.Login}>
      <div className={styles.formContainer}>
        <div className={styles.heading}>
          <h1>Odin Book</h1>
        </div>
        <form
          className={styles.form}
          action=""
          method="post"
          onSubmit={onSubmitForm}
        >
          <div className={styles.inputContainer}>
            <input
              className={emailError ? styles.inputError : styles.input}
              type="text"
              name="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <div className={styles.formError}>{emailError}</div>
          </div>
          <div className={styles.inputContainer}>
            <input
              className={passwordError ? styles.inputError : styles.input}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div className={styles.formError}>{passwordError}</div>
          </div>
          {formLoading ? (
            <div className={styles.formLoaderContainer}>
              <div className={styles.formLoader}></div>
            </div>
          ) : (
            <button
              className={loginActive ? styles.button : styles.buttonDisable}
              type="submit"
            >
              Log In
            </button>
          )}
          <Link className={styles.a} exact="true" to="/signup">
            Sign Up
          </Link>
          <div className={styles.break}></div>
          <button className={styles.button} onClick={onGithubLogin}>
            GitHub
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
