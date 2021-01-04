const action = (type, payload = {}) => {
  return { type, payload };
};

export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGIN_AGAIN = 'LOGIN_AGAIN';
export const REQUESTED_USER = 'REQUESTED_USER';
export const REQUEST_USER_SUCCESS = 'REQUEST_USER_SUCCESS';
export const REQUEST_USER_FAILURE = 'REQUEST_USER_FAILURE';
export const CLEAR_USER_ERROR = 'CLEAR_USER_ERROR';

export default action;
