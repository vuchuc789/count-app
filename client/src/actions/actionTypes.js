const action = (type, payload = {}) => {
  return { type, payload };
};

// User's actions
export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const LOGIN_AGAIN = 'LOGIN_AGAIN';
export const REQUESTED_USER = 'REQUESTED_USER';
export const REQUEST_USER_SUCCESS = 'REQUEST_USER_SUCCESS';
export const REQUEST_USER_FAILURE = 'REQUEST_USER_FAILURE';
export const CLEAR_USER_ERROR = 'CLEAR_USER_ERROR';

// Timekeeper's actions
export const CREATE = 'CREATE';
export const CREATE_REQUESTED = 'CREATE_REQUESTED';
export const CREATE_SUCCESS = 'CREATE_SUCCESS';
export const CREATE_FAILURE = 'CREATE_FAILURE';
export const GET_ALL = 'GET_ALL';
export const GET_ALL_REQUESTED = 'GET_ALL_REQUESTED';
export const GET_ALL_SUCCESS = 'GET_ALL_SUCCESS';
export const GET_ALL_FAILURE = 'GET_ALL_FAILURE';
export const DELETE = 'DELETE';
export const DELETE_REQUESTED = 'DELETE_REQUESTED';
export const DELETE_SUCCESS = 'DELETE_SUCCESS ';
export const DELETE_FAILURE = 'DELETE_FAILURE ';
export const UPDATE = 'UPDATE';
export const UPDATE_REQUESTED = 'UPDATE_REQUESTED';
export const UPDATE_SUCCESS = 'UPDATE_SUCCESS';
export const UPDATE_FAILURE = 'UPDATE_FAILURE';
export const CLEAR_TIMEKEEPER_ERROR = 'CLEAR_TIMEKEEPER_ERROR';
export const GET = 'GET';
export const GET_REQUESTED = 'GET_REQUESTED';
export const GET_SUCCESS = 'GET_SUCCESS';
export const GET_FAILURE = 'GET_FAILURE';
export const RESET_GET = 'RESET_GET';
export const GET_MESSAGE = 'GET_MESSAGE';
export const GET_MESSAGE_REQUESTED = 'GET_MESSAGE_REQUESTED';
export const GET_MESSAGE_SUCCESS = 'GET_MESSAGE_SUCCESS';
export const GET_MESSAGE_FAILURE = 'GET_MESSAGE_FAILURE';

// Database's actions
export const DATABASE_INITIATED = 'DATABASE_INITIATED';

export default action;
