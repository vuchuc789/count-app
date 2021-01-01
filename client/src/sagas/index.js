import { all, fork } from 'redux-saga/effects';

const rootSaga = function* () {
  yield all([fork()]);
};

export default rootSaga;
