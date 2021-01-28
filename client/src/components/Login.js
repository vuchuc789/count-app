import { useEffect, useMemo, useState } from 'react';
import userActions from '../actions/userActions';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

const Input = (props) => {
  const { data, focused, setFocus, setContent } = props;
  const [value, setValue] = useState('');
  const { id, placeholder, label, action } = data;
  const dispatch = useDispatch();

  const onFocus = (e) => {
    setFocus(e.target.id);
  };

  const onChange = (e) => {
    setValue(e.target.value);

    if (focused) {
      setContent(e.target.value);
    }
  };

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      dispatch(action(value));
    }
  };

  useEffect(() => {
    setValue('');
  }, [focused]);

  return (
    <div className="fl login-input">
      <label className="login-label no-select" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="login-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        autoComplete="off"
        onKeyPress={onEnter}
      />
    </div>
  );
};

Input.propTypes = {
  data: PropTypes.exact({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
  }).isRequired,
  focused: PropTypes.bool.isRequired,
  setFocus: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
};

const Login = () => {
  const [focusedInputId, setFocusedInputId] = useState('');
  const [focusedInputContent, setFocusedInputContent] = useState('');
  const userError = useSelector((state) => state.user.error);
  const userLoading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  const dataInputFields = useMemo(
    () => [
      {
        id: 'nickname',
        label: 'Nickname',
        placeholder: 'teobeobeo',
        action: userActions.register,
      },
      {
        id: 'userId',
        label: 'User ID',
        placeholder: 'an existed id',
        action: userActions.login,
      },
    ],
    []
  );

  const inputFields = dataInputFields.map((data, i) => {
    return (
      <Input
        key={i}
        data={data}
        setFocus={setFocusedInputId}
        setContent={setFocusedInputContent}
        focused={focusedInputId === data.id}
      />
    );
  });

  const onStart = () => {
    const obj = dataInputFields.find((obj) => obj.id === focusedInputId);

    if (obj) {
      dispatch(obj.action(focusedInputContent));
    }
  };

  useEffect(() => {
    if (userError) {
      const clearError = setTimeout(() => {
        dispatch(userActions.clearError());
      }, 2000);

      return () => {
        clearTimeout(clearError);
      };
    }
  }, [userError]);

  return (
    <div className="main-container fl fl-jc-ct fl-ai-ct">
      <div className="main-inside-container fl fl-jc-ct fl-ai-ct fl-di-co">
        <h2 className="login-header no-select">Hi, this is my countdown app</h2>
        {userError && <p className="err-notification no-select">{userError}</p>}
        {inputFields}
        <div className="login-button no-select" onClick={onStart}>
          Start 🔥
        </div>
      </div>
      <div
        className={`spinner-background${
          userLoading ? '' : 'spinner-invisible'
        }`}
      >
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Login;
