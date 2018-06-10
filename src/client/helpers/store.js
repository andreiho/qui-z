import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { sessionService } from 'redux-react-session';
import rootReducer from '../reducers';

const middlewares = [ thunkMiddleware ];

if (process.env.NODE_ENV === 'development') {
  const { createLogger } = require('redux-logger');
  middlewares.push(createLogger());
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

sessionService.initSessionService(store, { driver: 'COOKIES' });

export default store;