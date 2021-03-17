import { call, put, select, takeEvery } from 'redux-saga/effects';
import api from '../api';
import {
  CREATE,
  DELETE,
  GET_ALL,
  UPDATE,
  GET,
  GET_MESSAGE,
} from '../actions/actionTypes';
import timekeeperActions from '../actions/timekeeperActions';
import timekeeperApi from '../api/timekeeperApi';

function* createTimekeeper(action) {
  try {
    const isCreating = yield select((state) => state.timekeeper.isCreating);

    if (!isCreating) {
      yield put(timekeeperActions.createRequested());

      const response = yield call(
        api.timekeeper.createNewTimekeeper,
        action.payload
      );

      if (!response.error) {
        yield put(
          timekeeperActions.createdSuccess({
            id: response._id,
            title: response.title,
            message: response.message,
            timestamp: response.timestamp,
          })
        );
      } else {
        yield put(timekeeperActions.createdFailure(response.error));
      }
    } else {
      yield put(timekeeperActions.createdFailure('A timekeeper is creating'));
    }
  } catch (error) {
    yield put(timekeeperActions.createdFailure(error.message));
  }
}

export function* watchCreateTimekeeper() {
  yield takeEvery(CREATE, createTimekeeper);
}

function* getAllTimekeepers() {
  try {
    const isGettingAll = yield select((state) => state.timekeeper.isGettingAll);

    if (!isGettingAll) {
      yield put(timekeeperActions.getAllRequested());

      const response = yield call(api.timekeeper.getAllTimekeepers);

      if (!response.error) {
        yield put(
          timekeeperActions.getAllSuccess(
            response.map(({ _id, title, message, timestamp }) => {
              return { id: _id, title, message, timestamp };
            })
          )
        );
      } else {
        yield put(timekeeperActions.getAllFailure(response.error));
      }
    } else {
      yield put(timekeeperActions.getAllFailure('Timekeepers are fetching'));
    }
  } catch (error) {
    console.error(error);
    yield put(timekeeperActions.getAllFailure(error.message));
  }
}

export function* watchGetAllTimekeepers() {
  yield takeEvery(GET_ALL, getAllTimekeepers);
}

function* deleteTimekeeper(action) {
  try {
    const isUpdatingOrDeleting = yield select(
      (state) => state.timekeeper.isUpdatingOrDeleting
    );

    if (!isUpdatingOrDeleting) {
      yield put(timekeeperActions.deleteRequested());

      const response = yield call(
        api.timekeeper.deleteATimekeeper,
        action.payload.id
      );

      if (!response.error) {
        yield put(timekeeperActions.deleteSuccess({ id: response._id }));
      } else {
        yield put(timekeeperActions.deleteFailure(response.error));
      }
    } else {
      yield put(
        timekeeperActions.updateFailure('A timekeeper is updating or deleting')
      );
    }
  } catch (error) {
    yield put(timekeeperActions.deleteFailure(error.message));
  }
}

export function* watchDeleteTimekeeper() {
  yield takeEvery(DELETE, deleteTimekeeper);
}

function* updateTimekeeper(action) {
  try {
    const isUpdatingOrDeleting = yield select(
      (state) => state.timekeeper.isUpdatingOrDeleting
    );

    if (!isUpdatingOrDeleting) {
      yield put(timekeeperActions.updateRequested());

      const { id, ...newTimekeeper } = action.payload;
      if (Object.keys(newTimekeeper).length === 0) {
        yield put(
          timekeeperActions.updateFailure('This timekeeper was not changed')
        );
        return;
      }

      const response = yield call(
        api.timekeeper.updateATimekeeper,
        action.payload
      );

      if (!response.error) {
        yield put(
          timekeeperActions.updateSuccess({
            id: response._id,
            title: response.title,
            message: response.message,
            timestamp: response.timestamp,
          })
        );
      } else {
        yield put(timekeeperActions.updateFailure(response.error));
      }
    } else {
      yield put(
        timekeeperActions.updateFailure('A timekeeper is updating or deleting')
      );
    }
  } catch (error) {
    yield put(timekeeperActions.updateFailure(error.message));
  }
}

export function* watchUpdateTimekeeper() {
  yield takeEvery(UPDATE, updateTimekeeper);
}

function* getTimekeeper(action) {
  try {
    const isGetting = yield select((state) => state.timekeeper.isGetting);

    if (!isGetting) {
      yield put(timekeeperActions.getRequested());

      if (action.payload.id) {
        const response = yield call(
          timekeeperApi.getATimekeeper,
          action.payload.id
        );

        if (!response.error) {
          yield put(
            timekeeperActions.getSuccess({
              id: response._id,
              title: response.title,
              timestamp: response.timestamp,
            })
          );
        } else {
          yield put(timekeeperActions.getFailure());
        }
      } else {
        yield put(timekeeperActions.getFailure());
      }
    } else {
      yield put(timekeeperActions.getFailure());
    }
  } catch (error) {
    yield put(timekeeperActions.getFailure());
  }
}

export function* watchGetTimekeeper() {
  yield takeEvery(GET, getTimekeeper);
}

function* getMessage(action) {
  try {
    const messageIsGetting = yield select(
      (state) => state.timekeeper.messageIsGetting
    );

    if (!messageIsGetting) {
      yield put(timekeeperActions.getMessageRequested());

      const response = yield call(
        timekeeperApi.getTimekeeperMessage,
        action.payload.timekeeperId
      );

      if (!response.error) {
        yield put(
          timekeeperActions.getMessageSuccess({ message: response.message })
        );
      } else {
        yield put(timekeeperActions.getMessageFailure(response.error));
      }
    } else {
      yield put(timekeeperActions.getMessageFailure('Message is getting'));
    }
  } catch (error) {
    yield put(timekeeperActions.getMessageFailure(error.message));
  }
}

export function* watchGetMessage() {
  yield takeEvery(GET_MESSAGE, getMessage);
}
