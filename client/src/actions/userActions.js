import action, {
  REGISTER,
  LOGIN,
  LOGIN_AGAIN,
  REQUEST_USER_SUCCESS,
  REQUEST_USER_FAILURE,
  REQUESTED_USER,
  CLEAR_USER_ERROR,
} from './actionTypes';

const userActions = {
  register: (nickname) => action(REGISTER, { nickname }),
  login: (userId) => action(LOGIN, { userId }),
  loginAgain: () => action(LOGIN_AGAIN),
  requested: () => action(REQUESTED_USER),
  requestSuccess: (response) => action(REQUEST_USER_SUCCESS, { response }),
  requestFailure: (error) => action(REQUEST_USER_FAILURE, { error }),
  clearError: () => action(CLEAR_USER_ERROR),
};

export default userActions;
