import { call, put, select, takeEvery } from 'redux-saga/effects';
import api from '../api';
import { REGISTER, LOGIN, LOGIN_AGAIN } from '../actions/actionTypes';
import userActions from '../actions/userActions';

function* registerAndLogin(action) {
  try {
    const loading = yield select((state) => state.user.loading);

    if (!loading) {
      yield put(userActions.requested());

      let response = {};
      switch (action.type) {
        case REGISTER:
          if (!action.payload.nickname) {
            yield put(userActions.requestFailure('Nickname is required'));
            return;
          }

          response = yield call(api.user.register, action.payload.nickname);
          break;

        case LOGIN:
          if (!action.payload.userId) {
            yield put(userActions.requestFailure('User ID is required'));
            return;
          }

          response = yield call(api.user.login, action.payload.userId);
          break;

        default:
          yield put(userActions.requestFailure('Something went wrong'));
          return;
      }

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
