import { all, fork } from 'redux-saga/effects';
import { watchLoginAgain, watchRegisterAndLogin } from './userSagas';

const rootSaga = function* () {
  yield all([fork(watchRegisterAndLogin), fork(watchLoginAgain)]);
};

export default rootSaga;
