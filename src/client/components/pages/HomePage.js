import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CardColumns } from 'reactstrap';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';

import { quizActions } from '../../actions/quizActions';
import QuizCard from '../QuizCard';

class HomePage extends React.Component {
  componentDidMount() {
    this.props.dispatch(quizActions.getAll());
  }

  render() {
    const { user, authenticated, loading, quizzes } = this.props;

    return (
      <div>
        {/* {loading && <em>Loading quizzes...</em>} */}

        { quizzes &&
          <div>
            <Fade>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{quizzes.length === 1 ? '1 quiz' : `${quizzes.length} quizzes`}</h4>
                <Link to="/new" className="btn btn-success">Create your own</Link>
              </div>
            </Fade>

            <CardColumns>
              { quizzes.map((quiz, index) =>
                <Zoom delay={100 * index}>
                  <QuizCard key={index} quiz={quiz} />
                </Zoom>
              )}
            </CardColumns>
          </div>
        }
      </div>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string
  }),
  loading: PropTypes.bool,
  quizzes: PropTypes.arrayOf(PropTypes.object)
};

const mapState = ({ session, quiz }) => ({
  user: session.user,
  checked: session.checked,
  authenticated: session.authenticated,
  quizzes: quiz.quizzes,
  loading: quiz.loading
});

export default connect(mapState)(HomePage);