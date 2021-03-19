import { combineReducers } from 'redux';
import userReducer from './userReducer';
import timekeeperReducer from './timekeeperReducer';
import databaseReducer from './databaseReducer';

const rootReducer = combineReducers({
  user: userReducer,
  timekeeper: timekeeperReducer,
  database: databaseReducer,
});

export default rootReducer;
