import action, {
  CREATE,
  CREATE_REQUESTED,
  CREATE_SUCCESS,
  CREATE_FAILURE,
  CLEAR_TIMEKEEPER_ERROR,
  GET_ALL,
  GET_ALL_REQUESTED,
  GET_ALL_SUCCESS,
  GET_ALL_FAILURE,
  DELETE,
  DELETE_REQUESTED,
  DELETE_SUCCESS,
  DELETE_FAILURE,
  UPDATE,
  UPDATE_REQUESTED,
  UPDATE_SUCCESS,
  UPDATE_FAILURE,
  GET,
  GET_REQUESTED,
  GET_SUCCESS,
  GET_FAILURE,
  RESET_GET,
  GET_MESSAGE,
  GET_MESSAGE_REQUESTED,
  GET_MESSAGE_SUCCESS,
  GET_MESSAGE_FAILURE,
} from './actionTypes';

const timekeeperActions = {
  create: (timekeeperObject) => action(CREATE, timekeeperObject),
  createRequested: () => action(CREATE_REQUESTED),
  createdSuccess: (response) => action(CREATE_SUCCESS, response),
  createdFailure: (error) => action(CREATE_FAILURE, { error }),
  getAll: () => action(GET_ALL),
  getAllRequested: () => action(GET_ALL_REQUESTED),
  getAllSuccess: (response) =>
    action(GET_ALL_SUCCESS, { timekeepers: response }),
  getAllFailure: (error) => action(GET_ALL_FAILURE, { error }),
  delete: (id) => action(DELETE, { id }),
  deleteRequested: () => action(DELETE_REQUESTED),
  deleteSuccess: (response) => action(DELETE_SUCCESS, response),
  deleteFailure: (error) => action(DELETE_FAILURE, { error }),
  update: (newTimekeeperObject) => action(UPDATE, newTimekeeperObject),
  updateRequested: () => action(UPDATE_REQUESTED),
  updateSuccess: (response) => action(UPDATE_SUCCESS, response),
  updateFailure: (error) => action(UPDATE_FAILURE, { error }),
  get: (id) => action(GET, { id }),
  getRequested: () => action(GET_REQUESTED),
  getSuccess: (response) => action(GET_SUCCESS, response),
  getFailure: () => action(GET_FAILURE),
  resetGet: () => action(RESET_GET),
  getMessage: (timekeeperId) => action(GET_MESSAGE, { timekeeperId }),
  getMessageRequested: () => action(GET_MESSAGE_REQUESTED),
  getMessageSuccess: (response) => action(GET_MESSAGE_SUCCESS, response),
  getMessageFailure: (error) => action(GET_MESSAGE_FAILURE, { error }),
  clearError: () => action(CLEAR_TIMEKEEPER_ERROR),
};

export default timekeeperActions;
