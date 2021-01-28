import { combineReducers } from 'redux';
import userReducer from './userReducer';
import timekeeperReducer from './timekeeperReducer';

const rootReducer = combineReducers({
  user: userReducer,
  timekeeper: timekeeperReducer,
});

export default rootReducer;
