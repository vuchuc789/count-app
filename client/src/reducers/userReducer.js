import {
  CLEAR_USER_ERROR,
  REQUEST_USER_SUCCESS,
  REQUEST_USER_FAILURE,
  REQUESTED_USER,
} from '../actions/actionTypes';

const initialState = {
  userId: '',
  nickname: '',
  loading: false,
  error: '',
};

const userReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REQUESTED_USER:
      return {
        ...state,
        loading: true,
      };

    case REQUEST_USER_SUCCESS:
      return {
        ...state,
        userId: payload.response.userId,
        nickname: payload.response.nickname,
        loading: false,
        error: '',
      };

    case REQUEST_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };

    case CLEAR_USER_ERROR:
      return {
        ...state,
        error: '',
      };

    default:
      return state;
  }
};

export default userReducer;
