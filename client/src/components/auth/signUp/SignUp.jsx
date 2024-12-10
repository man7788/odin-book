import styles from './SignUp.module.css';
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import signUpFetch from '../../../fetch/signUpFetch';
import loginFetch from '../../../fetch/loginFetch';

function SignUp() {
  const [navHome, setNavHome] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [formError, setFromError] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [loginActive, setLoginActive] = useState(false);

  useEffect(() => {
    for (const error of formError) {
      if (/first name/i.test(error.msg)) {
        setFirstNameError(error.msg);
      } else if (/last name/i.test(error.msg)) {
        setLastNameError(error.msg);
      } else if (/email/i.test(error.msg)) {
        setEmailError(error.msg);
      } else if (/\bmatch/i.test(error.msg)) {
        setConfirmPasswordError(error.msg);
      } else if (/confirm password/i.test(error.msg)) {
        setConfirmPasswordError(error.msg);
      } else if (/\bpassword\b/i.test(error.msg)) {
        setPasswordError(error.msg);
      }
    }
  }, [formError]);

  useEffect(() => {
    setFirstNameError(null);
  }, [firstName]);

  useEffect(() => {
    setLastNameError(null);
  }, [lastName]);

  useEffect(() => {
    setEmailError(null);
  }, [email]);

  useEffect(() => {
    setPasswordError(null);
  }, [password]);

  useEffect(() => {
    setConfirmPasswordError(null);
  }, [confirmPassword]);

  useEffect(() => {
    if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    ) {
      setLoginActive(true);
    } else {
      setLoginActive(false);
    }
  }, [firstName, lastName, email, password, confirmPassword]);

  const autoLogin = async () => {
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

    setFormLoading(false);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const signUpPayload = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
    };
    const { result, error } = await signUpFetch(signUpPayload);

    if (error?.errors) {
      setFormLoading(false);
      setFromError(error.errors);
      setFormLoading(false);
      return;
    }

    if (error) {
      setServerError(true);
    }

    if (result) {
      autoLogin();
    }
  };

  if (serverError) {
    return <div className={styles.serverError}>Server Error</div>;
  }

  return (
    <div className={styles.SignUp}>
      <div className={styles.formContainer}>
        <div className={styles.heading}>
          <h1>Odin Book</h1>
        </div>
        <div className={styles.heading}>
          <h2>Sign Up</h2>
        </div>
        <form
          className={styles.form}
          action=""
          method="post"
          onSubmit={onSubmitForm}
        >
          <div className={styles.inputContainer}>
            <input
              className={firstNameError ? styles.inputError : styles.input}
              type="text"
              name="first_name"
              id="first_name"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
            <div className={styles.formError}>{firstNameError}</div>
          </div>
          <div className={styles.inputContainer}>
            <input
              className={lastNameError ? styles.inputError : styles.input}
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
            <div className={styles.formError}>{lastNameError}</div>
          </div>
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
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <div className={styles.formError}>{passwordError}</div>
          </div>
          <div className={styles.inputContainer}>
            <input
              className={
                confirmPasswordError ? styles.inputError : styles.input
              }
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <div className={styles.formError}>{confirmPasswordError}</div>
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
              Sign Up
            </button>
          )}

          <Link className={styles.a} to="/login">
            Log In
          </Link>
        </form>
      </div>
      {navHome && <Navigate to="/" replace={true} />}
    </div>
  );
}

export default SignUp;
