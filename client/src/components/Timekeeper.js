import { useState, useEffect, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import timekeeperActions from '../actions/timekeeperActions';
import PropTypes from 'prop-types';

const fiveMinutesInMilliseconds = 5 * 60 * 1000;

const Character = (props) => {
  const [lastDigit, currentDigit] = props.digits;

  return (
    <div className="tk-char">
      <div>{lastDigit}</div>
      <div>{currentDigit}</div>
    </div>
  );
};

Character.propTypes = {
  digits: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const Timekeeper = () => {
  const [destinationTimestamp, setDestinationTimestamp] = useState(null);
  const [ticking, setTicking] = useState(0);

  const [year, setYear] = useState([0, 0]);
  const [month, setMonth] = useState([0, 0]);
  const [day, setDay] = useState([0, 0]);
  const [hour, setHour] = useState([0, 0]);
  const [minute, setMinute] = useState([0, 0]);
  const [second, setSecond] = useState([0, 0]);

  const [timeoutId, setTimeoutId] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const timekeeper = useSelector(
    (state) => state.timekeeper.displayedTimekeeper,
    shallowEqual
  );

  const notFound = useSelector((state) => state.timekeeper.getFailure);
  const userId = useSelector((state) => state.user.userId);

  const calculateDifference = useCallback((timestamp) => {
    const timeAfterDelay = new Date(new Date().getTime() + 1000);
    const currentTimestamp = {
      year: timeAfterDelay.getFullYear(),
      month: timeAfterDelay.getMonth() + 1,
      day: timeAfterDelay.getDate(),
      hour: timeAfterDelay.getHours(),
      minute: timeAfterDelay.getMinutes(),
      second: timeAfterDelay.getSeconds(),
      millisecondEquals: timeAfterDelay.getTime(),
    };

    const diff = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
    };

    let subtrahend = { ...timestamp };
    let minuend = currentTimestamp;
    if (subtrahend.millisecondEquals < minuend.millisecondEquals) {
      const temp = subtrahend;
      subtrahend = minuend;
      minuend = temp;
    }

    if (subtrahend.second < minuend.second) {
      subtrahend.second += 60;
      subtrahend.minute -= 1;
    }
    diff.second += subtrahend.second - minuend.second;

    if (subtrahend.minute - minuend.minute + diff.minute < 0) {
      subtrahend.minute += 60;
      subtrahend.hour -= 1;
    }
    diff.minute += subtrahend.minute - minuend.minute;

    if (subtrahend.hour - minuend.hour + diff.hour < 0) {
      subtrahend.hour += 24;
      subtrahend.day -= 1;
    }
    diff.hour += subtrahend.hour - minuend.hour;

    const numberDaysOfSubtrahendMonthMinusOne = new Date(
      subtrahend.year,
      subtrahend.month - 1,
      0
    ).getDate();

    const numberDaysOfMinuendMonth = new Date(
      minuend.year,
      minuend.month,
      0
    ).getDate();

    if (
      subtrahend.day + numberDaysOfMinuendMonth - minuend.day + diff.day <
      0
    ) {
      subtrahend.day += numberDaysOfSubtrahendMonthMinusOne;
      subtrahend.month -= 1;
    }

    diff.day += subtrahend.day + numberDaysOfMinuendMonth - minuend.day;
    diff.month += Math.floor(diff.day / numberDaysOfMinuendMonth) - 1;
    diff.day %= numberDaysOfMinuendMonth;

    while (subtrahend.month - minuend.month + diff.month < 0) {
      subtrahend.month += 12;
      subtrahend.year -= 1;
    }
    diff.month += subtrahend.month - minuend.month;

    diff.year += subtrahend.year - minuend.year;

    return { diff, timeAfterDelay };
  }, []);

  const addZeros = useCallback((time, width) => {
    const time0 = `${'0'.repeat(width - `${time[0]}`.length)}${time[0]}`.split(
      ''
    );
    return `${'0'.repeat(width - `${time[1]}`.length)}${time[1]}`
      .split('')
      .map((val, i) => [time0[i], val]);
  });

  const yearCharacters = addZeros(year, 4).map((val, i) => (
    <Character key={`${i}${val[1]}`} digits={val} />
  ));

  const monthCharacters = addZeros(month, 2).map((val, i) => (
    <Character key={`${i}${val[1]}`} digits={val} />
  ));

  const dayCharacters = addZeros(day, 2).map((val, i) => (
    <Character key={`${i}${val[1]}`} digits={val} />
  ));

  const hourCharacters = addZeros(hour, 2).map((val, i) => (
    <Character key={`${i}${val[1]}`} digits={val} />
  ));

  const minuteCharacters = addZeros(minute, 2).map((val, i) => (
    <Character key={`${i}${val[1]}`} digits={val} />
  ));

  const secondCharacters = addZeros(second, 2).map((val, i) => (
    <Character key={`${i}${val[1]}`} digits={val} />
  ));

  useEffect(() => {
    dispatch(timekeeperActions.get(location.pathname.split('/')[2]));

    const interval = setInterval(() => {
      setTicking((oldState) => oldState + 1);
    }, 1000);

    return () => {
      clearInterval(interval);

      if (timeoutId > 0) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (notFound) {
      dispatch(timekeeperActions.resetGet());

      setTimeout(() => {
        history.push(userId ? '/dashboard' : '/notfound');
      }, 500);
    }
  }, [notFound]);

  useEffect(() => {
    if (destinationTimestamp !== null) {
      const tempYear = year[1];
      const tempMonth = month[1];
      const tempDay = day[1];
      const tempHour = hour[1];
      const tempMinute = minute[1];
      const tempSecond = second[1];

      const { diff, timeAfterDelay } = calculateDifference(
        destinationTimestamp
      );

      // remaining time to next render
      // 15 millisecond to render, 300 milliseconds for animation
      const remainingTime =
        Math.floor(timeAfterDelay.getTime() / 1000) * 1000 -
        new Date().getTime() -
        315;

      if (remainingTime < 0) {
        tempYear !== diff.year && setYear([tempYear, diff.year]);
        tempMonth !== diff.month && setMonth([tempMonth, diff.month]);
        tempDay !== diff.day && setDay([tempDay, diff.day]);
        tempHour !== diff.hour && setHour([tempHour, diff.hour]);
        tempSecond !== diff.minute && setMinute([tempMinute, diff.minute]);
        tempSecond !== diff.second && setSecond([tempSecond, diff.second]);
      } else {
        const timeout = setTimeout(() => {
          tempYear !== diff.year && setYear([tempYear, diff.year]);
          tempMonth !== diff.month && setMonth([tempMonth, diff.month]);
          tempDay !== diff.day && setDay([tempDay, diff.day]);
          tempHour !== diff.hour && setHour([tempHour, diff.hour]);
          tempSecond !== diff.minute && setMinute([tempMinute, diff.minute]);
          tempSecond !== diff.second && setSecond([tempSecond, diff.second]);
        }, remainingTime);

        setTimeoutId(timeout);
      }
    }
  }, [ticking]);

  useEffect(() => {
    let timeoutToGetMessage;
    let timeoutToShowMessage;
    let timeoutToHideMessage;

    if (timekeeper.timestamp) {
      const timestampObject = new Date(timekeeper.timestamp);

      setDestinationTimestamp({
        year: timestampObject.getFullYear(),
        month: timestampObject.getMonth() + 1,
        day: timestampObject.getDate(),
        hour: timestampObject.getHours(),
        minute: timestampObject.getMinutes(),
        second: timestampObject.getSeconds(),
        millisecondEquals: timestampObject.getTime(),
      });

      // get message at 5 minutes before timestamp
      const remainingTimeToShowMessage =
        timestampObject.getTime() - new Date().getTime();

      if (remainingTimeToShowMessage > fiveMinutesInMilliseconds) {
        timeoutToGetMessage = setTimeout(() => {
          dispatch(timekeeperActions.getMessage(timekeeper.id));
        }, remainingTimeToShowMessage - fiveMinutesInMilliseconds);
      } else if (remainingTimeToShowMessage > 0) {
        dispatch(timekeeperActions.getMessage(timekeeper.id));
      }

      if (remainingTimeToShowMessage > 0) {
        timeoutToShowMessage = setTimeout(() => {
          setShowMessage(true);
        }, remainingTimeToShowMessage);

        timeoutToHideMessage = setTimeout(() => {
          setShowMessage(false);
        }, remainingTimeToShowMessage + fiveMinutesInMilliseconds);
      }
    }

    return () => {
      if (timeoutToGetMessage) {
        clearTimeout(timeoutToGetMessage);
      }

      if (timeoutToShowMessage) {
        clearTimeout(timeoutToShowMessage);
      }

      if (timeoutToHideMessage) {
        clearTimeout(timeoutToHideMessage);
      }
    };
  }, [timekeeper.id]);

  return (
    <div className="fl fl-jc-ct fl-ai-ct main-container">
      <div className="fl fl-di-co fl-ai-ct tk-container no-select">
        <h2>{timekeeper.title}</h2>
        <div className="tk-clock-container">
          <div>
            <div>{yearCharacters}</div>
            <div>Years</div>
          </div>
          <div>
            <div>{monthCharacters}</div>
            <div>Months</div>
          </div>
          <div>
            <div>{dayCharacters}</div>
            <div>Days</div>
          </div>
          <div>
            <div>{hourCharacters}</div>
            <div>Hours</div>
          </div>
          <div>
            <div>{minuteCharacters}</div>
            <div>Minutes</div>
          </div>
          <div>
            <div>{secondCharacters}</div>
            <div>Seconds</div>
          </div>
        </div>
        {timekeeper.message && showMessage && (
          <p className="tk-message">{timekeeper.message}</p>
        )}
      </div>
      <div
        className={`spinner-background ${
          destinationTimestamp === null ? '' : 'spinner-invisible'
        }`}
      >
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Timekeeper;
