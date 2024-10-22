import styles from './SignUp.module.css';
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import signUpFetch from '../../fetch/signUpFetch';
import loginFetch from '../../fetch/loginFetch';

function SignUp() {
  const [navHome, setNavHome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [formError, setFromError] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const autoLogin = async () => {
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

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    const signUpPayload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    };
    const { result, error } = await signUpFetch(signUpPayload);

    if (error?.errors) {
      setFromError(error.errors);
    }

    if (error?.code) {
      setServerError(true);
    }

    if (result) {
      console.log(result);
      autoLogin();
    }

    setLoading(false);
  };

  if (loading) {
    return <div className={styles.SignUp}>Loading...</div>;
  }

  if (serverError) {
    return <div className={styles.SignUp}>Server Error</div>;
  }

  return (
    <div className={styles.SignUp}>
      Sign Up
      <div className={styles.formContainer}>
        <form action="" method="post" onSubmit={onSubmitForm}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
          </div>
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
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
          </div>
          <div className={styles.loginBtn}>
            <button className={styles.button} type="submit">
              Sign Up
            </button>
          </div>
        </form>
        {formError &&
          formError.map((error) => <div key={error.msg}>{error.msg}</div>)}
      </div>
      <Link to="/login">Log In</Link>
      {navHome && <Navigate to="/" replace={true} />}
    </div>
  );
}

export default SignUp;
