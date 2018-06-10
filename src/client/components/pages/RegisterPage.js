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

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: '',
        name: '',
        password: '',
        passwordConfirmation: ''
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
    const { user } = this.state;
    const { dispatch } = this.props;

    if (user.email && user.name && user.password) {
      dispatch(userActions.register(user));
    }
  }

  render() {
    const { registering } = this.props;
    const { user, submitted } = this.state;

    return (
      <Fade>
        <Row>
          <Col xs="12" sm="12" md={{ size: 6, offset: 3 }}>
            <div className="text-center">
              <img src={Logo} alt="Logo" width={96} height={96} className="mb-4" />
            </div>

            <Card>
              <CardBody className="p-md-5 p-xs-4">
                <h4 className="mb-4">Create an account</h4>

                <hr/>

                <Form name="form" onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="email">E-mail</Label>

                    <Input
                      name="email"
                      type="email"
                      id="email"
                      placeholder="you@example.com"
                      value={this.state.user.email}
                      onChange={this.handleChange}
                      invalid={submitted && !user.email}
                      autoFocus="true"
                    />

                    { submitted && !user.email &&
                      <FormFeedback invalid>You must provide an e-mail.</FormFeedback>
                    }
                  </FormGroup>

                  <FormGroup>
                    <Label for="name">Name</Label>

                    <Input
                        name="name"
                        type="text"
                        id="name"
                        value={this.state.user.name}
                        onChange={this.handleChange}
                        invalid={submitted && !user.name}
                      />

                      { submitted && !user.name &&
                        <FormFeedback invalid>You must provide a name.</FormFeedback>
                      }
                  </FormGroup>

                  <FormGroup>
                    <Label for="password">Password</Label>

                    <Input
                      name="password"
                      type="password"
                      id="password"
                      value={this.state.user.password}
                      onChange={this.handleChange}
                      invalid={submitted && !user.password}
                    />

                    { submitted && !user.password &&
                      <FormFeedback invalid>You must choose a password.</FormFeedback>
                    }
                  </FormGroup>

                  <FormGroup>
                    <Label for="passwordConfirmation">Confirm password</Label>

                    <Input
                      name="passwordConfirmation"
                      type="password"
                      id="passwordConfirmation"
                      value={this.state.user.passwordConfirmation}
                      onChange={this.handleChange}
                      invalid={submitted && !user.passwordConfirmation || (user.password !== user.passwordConfirmation)}
                    />

                    { submitted && !user.passwordConfirmation &&
                      <FormFeedback invalid>You must confirm the password.</FormFeedback>
                    }
                    { submitted && user.password && user.passwordConfirmation && (user.password !== user.passwordConfirmation) &&
                      <FormFeedback invalid>You must confirm the password.</FormFeedback>
                    }
                  </FormGroup>

                  <FormGroup check>
                    <Label check>
                      <Input type="checkbox" /> I agree to the <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>
                    </Label>
                  </FormGroup>

                  <FormGroup className="mt-4">
                    <Button color="primary" disabled={registering} block>
                      { registering ? 'Creating your account...' : 'Create an account' }
                    </Button>
                  </FormGroup>

                  <div className="mt-2 text-center">
                    Already have an account? <Link to="/login">Log in</Link>
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

RegisterPage.propTypes = {
  registering: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

const mapState = ({ register }) => ({
  registering: register.registering
});

export default connect(mapState)(RegisterPage);