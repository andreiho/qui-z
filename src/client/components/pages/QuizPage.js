import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form } from 'reactstrap';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';

import { quizActions } from '../../actions/quizActions'
import { alertActions } from '../../actions/alertActions'
import QuestionCard from '../QuestionCard';

class QuizPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: {}
    }

    this.delete = this.delete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOptionSelected = this.handleOptionSelected.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.props.dispatch(quizActions.getBySlug(match.params.slug));
  }

  delete(id) {
    this.props.dispatch(quizActions.delete(id));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { response } = this.state;
    const { quiz } = this.props;

    if (Object.keys(response).length) {
      this.props.dispatch(quizActions.submitResponse(quiz._id, response));
    } else {
      this.props.dispatch(alertActions.error('You must answer at least one question.'));
    }
  }

  handleOptionSelected(question, option) {
    const { response } = this.state;

    this.setState({
      response: Object.assign({}, response, {
        [question]: option
      })
    });
  }

  render() {
    const { loading, quiz, user, correctAnswers, submitting } = this.props;
    const zoomDelay = 100;

    return (
      <div>
        { quiz &&
          <div>
            <Fade>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{quiz.name}</h4>

                { quiz.author._id === user._id &&
                  <Button color="danger" onClick={() => this.delete(quiz._id)} outline disabled={quiz.deleting}>
                    { quiz.deleting ? 'Deleting...' : 'Delete this quiz'}
                  </Button>
                }
              </div>
            </Fade>

            <Form name="form" onSubmit={this.handleSubmit}>
              { quiz.questions.map((question, index) =>
                <Zoom delay={zoomDelay * index}>
                  <QuestionCard
                    key={index}
                    index={index}
                    question={question}
                    onOptionSelected={this.handleOptionSelected}
                    correctAnswer={correctAnswers && correctAnswers[question._id]}
                  />
                </Zoom>
              )}

              <Zoom delay={zoomDelay * quiz.questions.length}>
                { typeof correctAnswers === 'undefined' &&
                  <Button color="primary" disabled={submitting} block>
                    { submitting ? 'Submitting your answers...' : 'Submit your answers' }
                  </Button>
                }
              </Zoom>
            </Form>
          </div>
        }
      </div>
    );
  }
}

QuizPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  quiz: PropTypes.object,
  submitting: PropTypes.bool,
  correctAnswers: PropTypes.object
};

const mapState = ({ quiz, session }) => ({
  loading: quiz.loading,
  quiz: quiz.item,
  user: session.user,
  submitting: quiz.submitting,
  correctAnswers: quiz.correctAnswers
});

export default connect(mapState)(QuizPage);