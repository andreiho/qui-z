import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import {
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Button,
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap';

import { userActions } from '../../actions/userActions'
const Logo = require('!!svg-url-loader?noquotes!../../../../public/images/logo.svg');

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: '',
        password: '',
      },
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;

    this.setState({
      user: Object.assign({}, user, {
        [name]: value
      })
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state.user;
    const { dispatch } = this.props;

    if (email, password) {
      dispatch(userActions.login(email, password));
    }
  }

  render() {
    const { loggingIn } = this.props;
    const { user: { email, password }, submitted } = this.state;

    return (
      <Fade>
        <Row>
          <Col xs="12" md={{ size: 6, offset: 3 }}>
            <div className="text-center">
              <img src={Logo} alt="Logo" width={96} height={96} className="mb-4" />
            </div>

            <Card>
              <CardBody className="p-md-5 p-xs-4">
                <h4 className="mb-4">Log in</h4>

                <hr/>

                <Form name="form" onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="email">E-mail</Label>

                    <Input
                      name="email"
                      type="email"
                      id="email"
                      value={this.state.user.email}
                      onChange={this.handleChange}
                      invalid={submitted && !email}
                      autoFocus="true"
                    />

                    { submitted && !email &&
                      <FormFeedback invalid>Please enter your e-mail.</FormFeedback>
                    }
                  </FormGroup>

                  <FormGroup>
                    <Label for="password">Password</Label>

                    <Input
                      name="password"
                      type="password"
                      id="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      invalid={submitted && !password}
                    />

                    { submitted && !password &&
                      <FormFeedback invalid>Please enter your password.</FormFeedback>
                    }
                  </FormGroup>

                  <FormGroup className="mt-4">
                    <Button color="primary" disabled={loggingIn} block>
                      { loggingIn ? 'Logging in...' : 'Log in' }
                    </Button>
                  </FormGroup>

                  <div className="mt-2 text-center">
                    Don't have an account? <Link to="/register">Create one</Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fade>
    );
  }
}

LoginPage.propTypes = {
  loggingIn: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

const mapState = ({ auth }) => ({
  loggingIn: auth.loggingIn
});

export default connect(mapState)(LoginPage);