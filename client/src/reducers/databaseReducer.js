import { DATABASE_INITIATED } from '../actions/actionTypes';

const initialState = {
  isInitiated: false,
};

const databaseReducer = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case DATABASE_INITIATED:
      return {
        ...statusbar,
        isInitiated: true,
      };
    default:
      return state;
  }
};

export default databaseReducer;
