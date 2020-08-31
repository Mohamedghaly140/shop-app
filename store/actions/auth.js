export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD82C9qyC7K1C-_2OoDC9t0K2CwaX91R5o',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message;
      if (errorId === 'EMAIL_EXISTS') {
        message = 'The email address is already in use by another account.';
      } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message =
          'We have blocked all requests from this device due to unusual activity. Try again later.';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch({ type: SIGNUP });
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD82C9qyC7K1C-_2OoDC9t0K2CwaX91R5o',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message;
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found! Maybe Sign Up';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch({ type: SIGNUP });
  };
};
