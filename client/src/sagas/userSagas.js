import { call, put, select, takeEvery } from 'redux-saga/effects';
import api from '../apis';
import { REGISTER, LOGIN, LOGIN_AGAIN } from '../actions/actionTypes';
import userActions from '../actions/userActions';

function* registerAndLogin(action) {
  try {
    const loading = yield select((state) => state.user.loading);

    if (!loading) {
      yield put(userActions.requested());

      const response =
        action.type === REGISTER
          ? yield call(api.user.register, action.payload.nickname)
          : yield call(api.user.login, action.payload.userId);

      if (!response.error) {
        yield put(
          userActions.requestSuccess({
            userId: response._id,
            nickname: response.nickname,
          })
        );
      } else {
        yield put(userActions.requestFailure(response.error));
      }
    } else {
      yield put(userActions.requestFailure('User is loading'));
    }
  } catch (error) {
    yield put(userActions.requestFailure(error.message));
  }
}

export function* watchRegisterAndLogin() {
  yield takeEvery([REGISTER, LOGIN], registerAndLogin);
}

function* loginAgain(action) {
  try {
    const loading = yield select((state) => state.user.loading);

    if (!loading) {
      yield put(userActions.requested());

      const userIdResponse = yield call(api.user.checkLoggedIn);

      if (userIdResponse.error) {
        yield put(userActions.requestFailure(''));
        return;
      }

      const nicknameResponse = yield call(api.user.getNickname);

      if (nicknameResponse.error) {
        yield put(userActions.requestFailure(''));
        return;
      }

      yield put(
        userActions.requestSuccess({ ...userIdResponse, ...nicknameResponse })
      );
    } else {
      yield put(userActions.requestFailure('User is loading'));
    }
  } catch (error) {
    yield put(userActions.requestFailure(error.message));
  }
}

export function* watchLoginAgain() {
  yield takeEvery(LOGIN_AGAIN, loginAgain);
}
