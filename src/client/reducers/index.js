import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';

import register from './registerReducer';
import auth from './authReducer';
import alert from './alertReducer';
import quiz from './quizReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  register,
  auth,
  alert,
  quiz
});

export default rootReducer;