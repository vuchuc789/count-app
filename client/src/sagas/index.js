import { all, fork } from 'redux-saga/effects';
import { watchLoginAgain, watchRegisterAndLogin } from './userSagas';
import {
  watchCreateTimekeeper,
  watchDeleteTimekeeper,
  watchGetAllTimekeepers,
  watchUpdateTimekeeper,
  watchGetTimekeeper,
  watchGetMessage,
} from './timekeeperSagas';

const rootSaga = function* () {
  yield all([
    fork(watchRegisterAndLogin),
    fork(watchLoginAgain),
    fork(watchCreateTimekeeper),
    fork(watchGetAllTimekeepers),
    fork(watchDeleteTimekeeper),
    fork(watchUpdateTimekeeper),
    fork(watchGetTimekeeper),
    fork(watchGetMessage),
  ]);
};

export default rootSaga;
