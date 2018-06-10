import { sessionService } from 'redux-react-session';

import { userConstants } from '../constants/userConstants';
import { userService } from '../services/userService';
import { alertActions } from '../actions/alertActions';
import history from '../helpers/history';

const register = (user) => {
  const request = user => ({ type: userConstants.REGISTER_REQUEST, user });
  const success = user => ({ type: userConstants.REGISTER_SUCCESS, user });
  const failure = error => ({ type: userConstants.REGISTER_FAILURE, error });

  return dispatch => {
    dispatch(request(user));

    userService.register(user)
      .then(newUser => {
        dispatch(success(newUser));
        dispatch(login(user.email, user.password));
      })
      .catch(error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  }
}

const login = (email, password) => {
  const request = user => ({ type: userConstants.LOGIN_REQUEST, user });
  const success = user => ({ type: userConstants.LOGIN_SUCCESS, user });
  const failure = error => ({ type: userConstants.LOGIN_FAILURE, error });

  return dispatch => {
    dispatch(request({ email }));

    userService.login(email, password)
      .then(res => {
        return sessionService.saveSession(res.sessionId)
          .then(() => sessionService.saveUser(res.user))
          .then(() => {
            dispatch(success(res.user));
            history.push('/');
            dispatch(alertActions.success('You are now logged in.'));
          });
      })
      .catch(error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  }
}

const logout = () => {
  const request = () => ({ type: userConstants.LOGOUT });

  return dispatch => {
    userService.logout()
      .then(() => {
        dispatch(request());
        sessionService.deleteSession();
        sessionService.deleteUser();
        history.push('/');
      })
      .catch(error => {
        dispatch(alertActions.error(error));
      });
  };
}

export const userActions = {
  register,
  login,
  logout
};