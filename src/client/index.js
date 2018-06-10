import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';

import store from './helpers/store';
import App from './components/App';
import css from './app.css';

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
