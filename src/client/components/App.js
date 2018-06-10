import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert, Container } from 'reactstrap';
import Shake from 'react-reveal/Shake';

import PrivateRoute from './PrivateRoute';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import QuizFormPage from './pages/QuizFormPage';
import NotFoundPage from './pages/NotFoundPage';
import { alertActions } from '../actions/alertActions';
import history from '../helpers/history';
import AppMenu from './AppMenu';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { dispatch } = this.props;
    history.listen((location, action) => {
      dispatch(alertActions.clear());
    });
  }

  render() {
    const { alert, checked, authenticated, dispatch } = this.props;

    return (
      <Router history={history}>
        { checked &&
          <div className="pt-5">
            <AppMenu authenticated={authenticated} />

            <Container>
              { alert.message &&
                <Shake>
                  <Alert color={alert.type} toggle={() => dispatch(alertActions.clear())} className="mb-4">
                    {alert.message}
                  </Alert>
                </Shake>
              }

              <Switch>
                <PrivateRoute exact path="/" component={HomePage} authenticated={authenticated} />
                <PrivateRoute path="/quiz/:slug" component={QuizPage} authenticated={authenticated} />
                <PrivateRoute exact path="/new" component={QuizFormPage} authenticated={authenticated} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/login" component={LoginPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Container>
          </div>
        }
      </Router>
    );
  }
}

App.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string
  }),
  dispatch: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapState = ({ alert, session }) => ({
  alert,
  checked: session.checked,
  authenticated: session.authenticated
});

export default connect(mapState)(App);