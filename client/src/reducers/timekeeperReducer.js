import {
  CREATE_REQUESTED,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  CLEAR_TIMEKEEPER_ERROR,
  GET_ALL_REQUESTED,
  GET_ALL_SUCCESS,
  GET_ALL_FAILURE,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  DELETE_REQUESTED,
  UPDATE_REQUESTED,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
} from '../actions/actionTypes';

const initialState = {
  timekeepers: [],
  isGettingAll: false,
  isCreating: false,
  isUpdatingOrDeleting: false,
  error: '',
};

const timekeeperReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case CREATE_REQUESTED:
      return {
        ...state,
        isCreating: true,
      };
    case CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        timekeepers: [...state.timekeepers, { ...payload }],
        error: '',
      };
    case CREATE_FAILURE:
      return {
        ...state,
        isCreating: false,
        error: payload.error,
      };
    case GET_ALL_REQUESTED:
      return {
        ...state,
        isGettingAll: true,
      };
    case GET_ALL_SUCCESS:
      return {
        ...state,
        isGettingAll: false,
        timekeepers: [...payload.timekeepers],
        error: '',
      };
    case GET_ALL_FAILURE:
      return {
        ...state,
        isGettingAll: false,
        error: payload.error,
      };
    case DELETE_REQUESTED:
      return {
        ...state,
        isUpdatingOrDeleting: true,
      };
    case DELETE_SUCCESS:
      return {
        ...state,
        isUpdatingOrDeleting: false,
        timekeepers: state.timekeepers.filter((val) => val.id !== payload.id),
        error: '',
      };
    case UPDATE_REQUESTED:
      return {
        ...state,
        isUpdatingOrDeleting: true,
      };
    case UPDATE_SUCCESS:
      return {
        ...state,
        isUpdatingOrDeleting: false,
        timekeepers: state.timekeepers.map((val) => {
          if (val.id === payload.id) {
            return payload;
          }

          return val;
        }),
        error: '',
      };
    case DELETE_FAILURE:
    case UPDATE_FAILURE:
      return {
        ...state,
        isUpdatingOrDeleting: false,
        error: payload.error,
      };
    case CLEAR_TIMEKEEPER_ERROR:
      return {
        ...state,
        error: '',
      };
    default:
      return state;
  }
};

export default timekeeperReducer;
