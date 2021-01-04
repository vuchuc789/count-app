import { useEffect, useMemo, useState } from 'react';
import '../styles/Login.css';
import userActions from '../actions/userActions';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

const Input = ({ data, focused, setFocus, setContent }) => {
  const [value, setValue] = useState('');

  const { id, placeholder } = data;

  const onFocus = (e) => {
    setFocus(e.target.id);
  };

  const onChange = (e) => {
    setValue(e.target.value);

    if (focused) {
      setContent(e.target.value);
    }
  };

  useEffect(() => {
    setValue('');
  }, [focused]);

  return (
    <input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
    />
  );
};

Input.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
  }).isRequired,
  focused: PropTypes.bool.isRequired,
  setFocus: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
};

const Login = () => {
  const [focusedInputId, setFocusedInputId] = useState('');
  const [focusedInputContent, setFocusedInputContent] = useState('');
  const userError = useSelector((state) => state.user.error);
  const dispatch = useDispatch();

  const dataInputFields = useMemo(
    () => [
      {
        id: 'nickname',
        placeholder: 'Your nickname...',
        action: userActions.register,
      },
      {
        id: 'userId',
        placeholder: 'Your exist id...',
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

  const onStart = (e) => {
    const obj = dataInputFields.find((obj) => obj.id === focusedInputId);

    if (obj) {
      dispatch(obj.action(focusedInputContent));
    }
  };

  useEffect(() => {
    if (userError) {
      const clearError = setTimeout(() => {
        dispatch(userActions.clearError());
      }, 3000);

      return () => {
        clearTimeout(clearError);
      };
    }
  }, [userError]);

  return (
    <>
      {userError && <p>{userError}</p>}
      {inputFields}
      <button onClick={onStart}>Start 🔥🔥🔥</button>
    </>
  );
};

export default Login;
