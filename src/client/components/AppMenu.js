import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import Fade from 'react-reveal/Fade';

import { userActions } from '../actions/userActions';

const Logo = require('!!svg-url-loader?noquotes!../../../public/images/logo.svg');

class AppMenu extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(userActions.logout());
  }

  render() {
    const { user, authenticated, dispatch } = this.props;

    return (
      <Navbar color="light" light expand="md" fixed="top">
        <Nav>
          <NavItem href="/">
            <Fade>
              <Link to="/">
                <img src={Logo} alt="Logo" width={38} height={38} className="mr-3" />
                <h5 className="d-inline text-body">qui-z</h5>
              </Link>
            </Fade>
          </NavItem>
        </Nav>

        { authenticated &&
          <Nav className="ml-auto flex-row" navbar>
            <NavItem>
              <Fade>
                <img className="rounded-circle mr-2" src={user.picture} alt="User avatar" width="38" />
              </Fade>
            </NavItem>

            <NavItem>
              <Fade>
                <NavLink href="#" className="mr-2">{user.name}</NavLink>
              </Fade>
            </NavItem>

            <NavItem>
              <Fade>
                <Button color="link" onClick={this.logout}>Log out</Button>
              </Fade>
            </NavItem>
          </Nav>
        }

        { !authenticated &&
          <Nav className="ml-auto flex-row" navbar>
            <NavItem>
              <Fade>
                <Link to="/register" className="mr-2 nav-link">Register</Link>
              </Fade>
            </NavItem>

            <NavItem>
              <Fade>
                <Link to="/login" className="btn btn-secondary">Log in</Link>
              </Fade>
            </NavItem>
          </Nav>
        }
      </Navbar>
    );
  }
}

AppMenu.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string
  }),
  authenticated: PropTypes.bool
};

const mapState = ({ session }) => ({
  user: session.user,
  checked: session.checked,
  authenticated: session.authenticated
});

export default connect(mapState)(AppMenu);