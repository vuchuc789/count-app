import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import timekeeperActions from '../actions/timekeeperActions';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const maxTimekeepersQuantity = 6;

const getTimeString = (dateString) => {
  const now = dateString ? new Date(dateString) : new Date();

  return [
    (now.getHours() < 10 ? '0' : '') + now.getHours(),
    (now.getMinutes() < 10 ? '0' : '') + now.getMinutes(),
  ].join(':');
};
const getDateString = (dateString) => {
  const now = dateString ? new Date(dateString) : new Date();

  return [
    now.getFullYear(),
    (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1),
    (now.getDate() < 10 ? '0' : '') + now.getDate(),
  ].join('-');
};

const TimekeeperInput = ({
  title,
  setTitle,
  message,
  setMessage,
  date,
  setDate,
  time,
  setTime,
}) => {
  return (
    <>
      <label htmlFor="newTitle">Title</label>
      <input
        type="text"
        id="newTitle"
        value={title}
        autoComplete="off"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <label htmlFor="newMessage">Message</label>
      <input
        type="text"
        id="newMessage"
        value={message}
        autoComplete="off"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <label htmlFor="newDate">Date</label>
      <input
        type="date"
        id="newDate"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <label htmlFor="newTime">Time</label>
      <input
        type="time"
        id="newTime"
        value={time}
        onChange={(e) => {
          setTime(e.target.value);
        }}
      />
    </>
  );
};

TimekeeperInput.propTypes = {
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  date: PropTypes.string.isRequired,
  setDate: PropTypes.func.isRequired,
  time: PropTypes.string.isRequired,
  setTime: PropTypes.func.isRequired,
};

const NewTimekeeper = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const [date, setDate] = useState(() => getDateString());

  const [time, setTime] = useState(() => getTimeString());

  const dispatch = useDispatch();

  const onCreate = () => {
    dispatch(
      timekeeperActions.create({
        title,
        message,
        timestamp: new Date(`${date} ${time}`),
      })
    );
    setTitle('');
    setMessage('');
    setDate(() => getDateString());
    setTime(() => getTimeString());
  };

  return (
    <div className="fl fl-jc-ct fl-di-co db-item-container db-input-container">
      <TimekeeperInput
        title={title}
        setTitle={setTitle}
        message={message}
        setMessage={setMessage}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
      />
      <div className="db-btn-container fl">
        <div className="no-select" onClick={onCreate}>
          Create
        </div>
      </div>
    </div>
  );
};

const Timekeeper = (props) => {
  const {
    id,
    title,
    message,
    timestamp,
    confirmation,
    setConfirmation,
    editingTimekeepers,
    setEditingTimekeepers,
  } = props;

  const history = useHistory();

  const onEdit = () => {
    if (!editingTimekeepers.includes(id)) {
      setEditingTimekeepers([...editingTimekeepers, id]);
    }
  };

  const onDelete = () => {
    if (!confirmation.type) {
      setConfirmation({ type: 'delete', timekeeperId: id });
    }
  };

  const onWatch = () => {
    history.push(`/timekeeper/${id}`);
  };

  return (
    <div className="fl fl-jc-ct fl-di-co db-item-container">
      <span>ID</span>
      <span>{id}</span>
      <span>Title</span>
      <span>{title}</span>
      <span>Message</span>
      <span>{message}</span>
      <span>Timestamp</span>
      <span>{new Date(timestamp).toString()}</span>
      <div className="db-btn-container fl">
        <div className="no-select" onClick={onWatch}>
          Watch
        </div>
        <div className="no-select" onClick={onEdit}>
          Edit
        </div>
        <div className="no-select" onClick={onDelete}>
          Delete
        </div>
      </div>
    </div>
  );
};

Timekeeper.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  confirmation: PropTypes.exact({
    type: PropTypes.string.isRequired,
    timekeeperId: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    timestamp: PropTypes.objectOf(Date),
  }).isRequired,
  setConfirmation: PropTypes.func.isRequired,
  editingTimekeepers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setEditingTimekeepers: PropTypes.func.isRequired,
};

const UserInfo = ({ nickname, id }) => {
  return (
    <div className="db-usr-info">
      <span className="no-select">Nickname:</span>
      <span>{nickname}</span>
      <span className="no-select">User ID:</span>
      <span>{id}</span>
    </div>
  );
};

UserInfo.propTypes = {
  nickname: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

const OverlayConfirmation = (props) => {
  const {
    confirmation,
    setConfirmation,
    editingTimekeepers,
    setEditingTimekeepers,
  } = props;

  const dispatch = useDispatch();

  let question, onYes;
  switch (confirmation.type) {
    case 'delete':
      question = 'Are you sure you want to delete this timekeeper?';
      onYes = () => {
        dispatch(timekeeperActions.delete(confirmation.timekeeperId));
        setConfirmation({ type: '', timekeeperId: '' });
      };
      break;
    case 'edit':
      question = 'Are you sure you want to edit this timekeeper?';
      onYes = () => {
        const { type, timekeeperId, ...newTimeKeeper } = confirmation;

        dispatch(
          timekeeperActions.update({ id: timekeeperId, ...newTimeKeeper })
        );

        if (editingTimekeepers.includes(timekeeperId)) {
          setEditingTimekeepers(
            editingTimekeepers.filter((val) => val !== timekeeperId)
          );
        }

        setConfirmation({ type: '', timekeeperId: '' });
      };
      break;
    default:
      question = '';
      onYes = () => {};
  }
  const onNo = () => {
    setConfirmation({ type: '', timekeeperId: '' });
  };

  return (
    <div className="db-overlay-cf fl fl-jc-ct fl-ai-ct fl-di-co">
      <div>
        <p className="db-overlay-cf-question no-select">{question}</p>
        <div className="fl fl-jc-sa">
          <div className="db-overlay-cf-btn no-select" onClick={onYes}>
            Yep, I want
          </div>
          <div className="db-overlay-cf-btn no-select" onClick={onNo}>
            Hmm, I&apos;ll rethink...
          </div>
        </div>
      </div>
    </div>
  );
};

OverlayConfirmation.propTypes = {
  confirmation: PropTypes.exact({
    type: PropTypes.string.isRequired,
    timekeeperId: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    timestamp: PropTypes.objectOf(Date),
  }).isRequired,
  setConfirmation: PropTypes.func.isRequired,
  editingTimekeepers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setEditingTimekeepers: PropTypes.func.isRequired,
};

const Editor = (props) => {
  const {
    id,
    title,
    message,
    timestamp,
    confirmation,
    setConfirmation,
    editingTimekeepers,
    setEditingTimekeepers,
  } = props;

  const [newTitle, setNewTitle] = useState(title);
  const [newMessage, setNewMessage] = useState(message);

  const dateString = getDateString(timestamp);
  const [newDate, setNewDate] = useState(dateString);

  const timeString = getTimeString(timestamp);
  const [newTime, setNewTime] = useState(timeString);

  const onEdit = () => {
    if (!confirmation.type) {
      const newTimekeeperConfirmation = { type: 'edit', timekeeperId: id };

      if (newTitle !== title) {
        newTimekeeperConfirmation.title = newTitle;
      }

      if (newMessage !== message) {
        newTimekeeperConfirmation.message = newMessage;
      }

      if (newDate !== dateString || newTime !== timeString) {
        newTimekeeperConfirmation.timestamp = new Date(`${newDate} ${newTime}`);
      }
      setConfirmation(newTimekeeperConfirmation);
    }
  };

  const onCancel = () => {
    if (editingTimekeepers.includes(id)) {
      setEditingTimekeepers(editingTimekeepers.filter((val) => val !== id));
    }
  };

  return (
    <div className="fl fl-jc-ct fl-di-co db-item-container db-input-container">
      <TimekeeperInput
        title={newTitle}
        setTitle={setNewTitle}
        message={newMessage}
        setMessage={setNewMessage}
        date={newDate}
        setDate={setNewDate}
        time={newTime}
        setTime={setNewTime}
      />
      <div className="db-btn-container fl">
        <div className="no-select" onClick={onEdit}>
          Edit
        </div>
        <div className="no-select" onClick={onCancel}>
          Cancel
        </div>
      </div>
    </div>
  );
};

Editor.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  confirmation: PropTypes.exact({
    type: PropTypes.string.isRequired,
    timekeeperId: PropTypes.string.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    timestamp: PropTypes.objectOf(Date),
  }).isRequired,
  setConfirmation: PropTypes.func.isRequired,
  editingTimekeepers: PropTypes.arrayOf(PropTypes.string).isRequired,
  setEditingTimekeepers: PropTypes.func.isRequired,
};

const Dashboard = () => {
  const [confirmation, setConfirmation] = useState({
    type: '',
    timekeeperId: '',
  });

  const [editingTimekeepers, setEditingTimekeepers] = useState([]);

  const timekeepers = useSelector(
    (state) => state.timekeeper.timekeepers,
    shallowEqual
  );
  const timekeepersList = timekeepers.map(
    ({ id, title, message, timestamp }, i) =>
      editingTimekeepers.includes(id) ? (
        <Editor
          key={i}
          id={id}
          title={title}
          message={message}
          timestamp={timestamp}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          editingTimekeepers={editingTimekeepers}
          setEditingTimekeepers={setEditingTimekeepers}
        />
      ) : (
        <Timekeeper
          key={i}
          id={id}
          title={title}
          message={message}
          timestamp={timestamp}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          editingTimekeepers={editingTimekeepers}
          setEditingTimekeepers={setEditingTimekeepers}
        />
      )
  );

  const { nickname, userId } = useSelector((state) => {
    const { nickname, userId } = state.user;

    return { nickname, userId };
  });

  const error = useSelector((state) => state.timekeeper.error);
  const loading = useSelector((state) => {
    const { isCreating, isUpdatingOrDeleting, isGettingAll } = state.timekeeper;

    return isCreating || isUpdatingOrDeleting || isGettingAll;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      const clearError = setTimeout(() => {
        dispatch(timekeeperActions.clearError());
      }, 2000);

      return () => {
        clearTimeout(clearError);
      };
    }
  }, [error]);

  return (
    <div className="main-container fl fl-jc-ct fl-ai-ct">
      <UserInfo nickname={nickname} id={userId} />
      {error && <p className="err-notification no-select">{error}</p>}
      <div className="main-inside-container db-container">
        {timekeepersList}
        {timekeepersList.length < maxTimekeepersQuantity ? (
          <NewTimekeeper />
        ) : null}
      </div>
      {confirmation.type && confirmation.timekeeperId && (
        <OverlayConfirmation
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          editingTimekeepers={editingTimekeepers}
          setEditingTimekeepers={setEditingTimekeepers}
        />
      )}
      <div
        className={`spinner-background ${loading ? '' : 'spinner-invisible'}`}
      >
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Dashboard;
