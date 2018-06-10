import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundPage extends React.Component {
  render() {
    return (
      <div>
        <h2>Oops!</h2>
        <hr/>
        <h3>You've wandered into the unknown... <Link to="/">Go back</Link> to safety!</h3>
      </div>
    );
  }
}

export default NotFoundPage;