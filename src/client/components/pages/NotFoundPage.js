import React from 'react';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

class NotFoundPage extends React.Component {
  render() {
    return (
      <Fade>
        <h2>Oops!</h2>
        <hr/>
        <h3>You've wandered into the unknown... <Link to="/">Go back</Link> to safety!</h3>
      </Fade>
    );
  }
}

export default NotFoundPage;