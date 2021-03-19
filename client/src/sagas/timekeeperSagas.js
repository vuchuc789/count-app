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
import IndexedDB from '../helpers/indexedDB';

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
        const responseTimekeeper = {
          id: response._id,
          title: response.title,
          message: response.message,
          timestamp: response.timestamp,
        };
        const db = new IndexedDB();

        yield put(timekeeperActions.createdSuccess(responseTimekeeper));

        if (db.isReady()) {
          yield call(db.add, responseTimekeeper);
        }
      } else {
        yield put(timekeeperActions.createdFailure(response.error));
      }
    } else {
      yield put(timekeeperActions.createdFailure('A timekeeper is creating'));
    }
  } catch (error) {
    yield put(timekeeperActions.createdFailure(error.message));
    console.error(error);
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
        const responseTimekeepers = response.map(
          ({ _id, title, message, timestamp }) => {
            return { id: _id, title, message, timestamp };
          }
        );
        const db = new IndexedDB();

        yield put(timekeeperActions.getAllSuccess(responseTimekeepers));

        if (db.isReady()) {
          yield call(db.addAll, responseTimekeepers);
        }
      } else {
        yield put(timekeeperActions.getAllFailure(response.error));
      }
    } else {
      yield put(timekeeperActions.getAllFailure('Timekeepers are fetching'));
    }
  } catch (error) {
    yield put(timekeeperActions.getAllFailure(error.message));
    console.error(error);
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
        const db = new IndexedDB();

        yield put(timekeeperActions.deleteSuccess({ id: response._id }));

        if (db.isReady()) {
          yield call(db.delete, response._id);
        }
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
    console.error(error);
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
        const responseTimekeeper = {
          id: response._id,
          title: response.title,
          message: response.message,
          timestamp: response.timestamp,
        };
        const db = new IndexedDB();

        yield put(timekeeperActions.updateSuccess(responseTimekeeper));

        if (db.isReady()) {
          yield call(db.add, responseTimekeeper);
        }
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
    console.error(error);
  }
}

export function* watchUpdateTimekeeper() {
  yield takeEvery(UPDATE, updateTimekeeper);
}

function* getTimekeeper(action) {
  try {
    const isGetting = yield select((state) => state.timekeeper.isGetting);

    if (!isGetting) {
      const db = new IndexedDB();
      let isFailure = true;
      let storedTimekeeper;

      yield put(timekeeperActions.getRequested());

      if (db.isReady()) {
        storedTimekeeper = yield call(db.retrieve, action.payload.id);

        if (storedTimekeeper) {
          yield put(
            timekeeperActions.getSuccess({
              id: storedTimekeeper.id,
              title: storedTimekeeper.title,
              timestamp: storedTimekeeper.timestamp,
            })
          );

          isFailure = false;
        }
      }

      const response = yield call(
        timekeeperApi.getATimekeeper,
        action.payload.id
      );

      if (!response.error) {
        const responseTimekeeper = {
          id: response._id,
          title: response.title,
          timestamp: response.timestamp,
        };

        if (!storedTimekeeper) {
          yield put(timekeeperActions.getSuccess(responseTimekeeper));
          isFailure = false;

          db.add({
            ...responseTimekeeper,
            message: '',
          });
        } else {
          if (
            storedTimekeeper.id !== responseTimekeeper.id ||
            storedTimekeeper.title !== responseTimekeeper.title ||
            storedTimekeeper.timestamp !== responseTimekeeper.timestamp
          ) {
            yield put(timekeeperActions.getSuccess(responseTimekeeper));
            isFailure = false;

            db.add({
              ...responseTimekeeper,
              message: storedTimekeeper.message,
            });
          }
        }
      }

      if (isFailure) {
        yield put(timekeeperActions.getFailure());
      }
    } else {
      yield put(timekeeperActions.getFailure());
    }
  } catch (error) {
    if (error.message !== 'Network Error') {
      yield put(timekeeperActions.getFailure());
    }
    console.error(error);
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
      const db = new IndexedDB();
      let isFailure = true;
      let storedTimekeeper;

      yield put(timekeeperActions.getMessageRequested());

      if (db.isReady()) {
        storedTimekeeper = yield call(db.retrieve, action.payload.timekeeperId);

        if (storedTimekeeper) {
          timekeeperActions.getMessageSuccess({
            message: storedTimekeeper.message,
          });

          isFailure = false;
        }
      }

      const response = yield call(
        timekeeperApi.getTimekeeperMessage,
        action.payload.timekeeperId
      );

      if (!response.error) {
        if (!storedTimekeeper) {
          timekeeperActions.getMessageSuccess({ message: response.message });
          isFailure = false;
        } else {
          if (response.message !== storedTimekeeper.message) {
            timekeeperActions.getMessageSuccess({ message: response.message });
            isFailure = false;
          }
        }
      }

      if (isFailure) {
        yield put(timekeeperActions.getMessageFailure('Something went wrong'));
      }
    } else {
      yield put(timekeeperActions.getMessageFailure('Message is getting'));
    }
  } catch (error) {
    yield put(timekeeperActions.getMessageFailure(error.message));
    console.error(error);
  }
}

export function* watchGetMessage() {
  yield takeEvery(GET_MESSAGE, getMessage);
}
