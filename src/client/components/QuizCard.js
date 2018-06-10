import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  CardText,
  Button,
  Badge
} from 'reactstrap';

import { quizActions } from '../actions/quizActions';

class QuizCard extends React.Component {
  constructor(props) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  delete(id) {
    this.props.dispatch(quizActions.delete(id));
  }

  render() {
    const { quiz, user } = this.props;

    return (
      <Card>
        <CardBody>
          <CardTitle>
            <div className="d-flex justify-content-between align-items-center">
              <div>{quiz.name}</div>
              <Badge color="light" pill>{quiz.questions.length === 1 ? '1 question' : `${quiz.questions.length} questions`}</Badge>
            </div>
          </CardTitle>

          <CardText>
            <small className="text-muted">
              Created <Moment fromNow>{quiz.created}</Moment> by { quiz.author._id === user._id ? 'You' : quiz.author.name}
            </small>
          </CardText>

          <div className="d-flex justify-content-between">
            <Link to={'/quiz/' + quiz.slug} className="btn btn-primary">Take this quiz</Link>

            { quiz.author._id === user._id &&
              <Button color="danger" onClick={() => this.delete(quiz._id)} outline disabled={quiz.deleting}>
                { quiz.deleting ? 'Deleting...' : 'Delete'}
              </Button>
            }
          </div>
        </CardBody>
      </Card>
    )
  }
}

QuizCard.propTypes = {
  quiz: PropTypes.object
};

const mapState = ({ session }) => ({
  user: session.user
});

export default connect(mapState)(QuizCard);