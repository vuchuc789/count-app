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
  GET_REQUESTED,
  GET_SUCCESS,
  GET_FAILURE,
  RESET_GET,
  GET_MESSAGE_REQUESTED,
  GET_MESSAGE_SUCCESS,
  GET_MESSAGE_FAILURE,
} from '../actions/actionTypes';

const initialState = {
  timekeepers: [],
  isGettingAll: false,
  isCreating: false,
  isUpdatingOrDeleting: false,
  displayedTimekeeper: {
    id: '',
    title: '',
    message: '',
    timestamp: '',
  },
  isGetting: false,
  getFailure: false,
  messageIsGetting: false,
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
    case GET_REQUESTED:
      return {
        ...state,
        isGetting: true,
      };
    case GET_SUCCESS:
      return {
        ...state,
        displayedTimekeeper: { ...state.displayedTimekeeper, ...payload },
        isGetting: false,
      };
    case GET_FAILURE:
      return {
        ...state,
        isGetting: false,
        getFailure: true,
      };
    case RESET_GET:
      return {
        ...state,
        getFailure: false,
      };
    case GET_MESSAGE_REQUESTED:
      return {
        ...state,
        messageIsGetting: true,
      };
    case GET_MESSAGE_SUCCESS:
      return {
        ...state,
        messageIsGetting: false,
        displayedTimekeeper: {
          ...state.displayedTimekeeper,
          message: payload.message,
        },
      };
    case GET_MESSAGE_FAILURE:
      return {
        ...state,
        messageIsGetting: false,
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
