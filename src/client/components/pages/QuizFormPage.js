import { times, isEmpty } from 'lodash';
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
  CardBody,
  CardHeader,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

import { quizActions } from '../../actions/quizActions'
import { quizConstants } from '../../constants/quizConstants'

class QuizFormPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quiz: {
        name: '',
        questions: [ quizConstants.EMPTY_QUESTION ]
      },
      submitted: false
    };

    this.optionCount = 4;

    this.addQuestion = this.addQuestion.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleQuizName = this.handleQuizName.bind(this);
    this.handleQuestionName = this.handleQuestionName.bind(this);
    this.handleOption = this.handleOption.bind(this);
  }

  addQuestion() {
    const { quiz } = this.state;

    this.setState({
      quiz: Object.assign({}, quiz, {
        questions: quiz.questions.concat([ quizConstants.EMPTY_QUESTION ])
      })
    });
  }

  removeQuestion(index) {
    const { quiz } = this.state;

    this.setState({
      quiz: Object.assign({}, quiz, {
        questions: quiz.questions.filter((_, i) => i !== index)
      })
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { quiz } = this.state;
    const { dispatch } = this.props;

    if (quiz.name && quiz.questions.length > 0) {
      // Check whether all questions have all options filled in
      const allFilled = quiz.questions.every(({ option1, option2, option3, option4 }) => {
        return !isEmpty(option1) && !isEmpty(option2) && !isEmpty(option3) && !isEmpty(option4);
      });

      if (allFilled) {
        dispatch(quizActions.create(quiz));
      }
    }
  }

  handleQuizName(event) {
    const { name, value } = event.target;
    const { quiz } = this.state;

    this.setState({
      quiz: Object.assign({}, quiz, {
        [name]: value
      })
    });
  }

  updateQuestion(questionIndex, prop, value) {
    const { quiz } = this.state;

    this.setState({
      quiz: Object.assign({}, quiz, {
        questions: quiz.questions.map((question, index) => {
          if (index === questionIndex) {
            return Object.assign({}, question, { [prop]: value });
          }
          return question;
        })
      })
    });
  }

  handleQuestionName(event) {
    const { name, value } = event.target;
    const { quiz } = this.state;
    const questionIndex = parseInt(name.split('question')[1], 10);

    this.updateQuestion(questionIndex, 'name', value);
  }

  handleOption(event) {
    const { name, value } = event.target
    const { quiz } = this.state;
    const questionIndex = parseInt(name.match(/question([\d]+)/)[1], 10);
    const optionIndex = parseInt(name.match(/option([\d]+)/)[1], 10);

    this.updateQuestion(questionIndex, `option${optionIndex + 1}`, value);
  }

  render() {
    const { submitting } = this.props;
    const { quiz, submitted } = this.state;
    const { questions } = quiz;
    const options = times(this.optionCount);

    return (
      <Fade>
        <Row>
          <Col xs="12" sm="12" md={{ size: 6, offset: 3 }}>
            <Card>
              <CardBody className="p-md-5 p-xs-4">
                <h4 className="mb-4">Create your quiz</h4>

                <hr/>

                <Form name="form" onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label for="name">Title</Label>

                    <Input
                      name="name"
                      type="text"
                      id="name"
                      placeholder="e.g. JavaScript Basics"
                      value={this.state.quiz.name}
                      onChange={this.handleQuizName}
                      invalid={submitted && !quiz.name}
                      autoFocus="true"
                    />

                    { submitted && !quiz.name &&
                      <FormFeedback>The quiz must have a title.</FormFeedback>
                    }
                  </FormGroup>

                  <div className="mb-3">
                    <div>Questions</div>
                    <small className="text-muted">Set the correct answer by checking the radio next to the option</small>
                  </div>

                  { questions.map((question, questionIndex) =>
                    <Fade key={`question${questionIndex}`}>
                      <Card className={questionIndex + 1 < questions.length ? 'mb-3' : ''}>
                        <CardBody>
                          <div className="d-flex justify-content-between">
                            <div className="flex-grow-1">
                              <Input
                                type="text"
                                name={`question${questionIndex}`}
                                placeholder={`Question ${questionIndex + 1}` }
                                value={this.state.quiz.questions[questionIndex].name}
                                onChange={this.handleQuestionName}
                                invalid={submitted && !questions[questionIndex].name}
                              />
                            </div>

                            { questions.length > 1 &&
                              <div>
                                <Button color="danger" className="ml-3" onClick={() => this.removeQuestion(questionIndex)} outline>&times;</Button>
                              </div>
                            }
                          </div>

                          <hr/>

                          { options.map((option, optionIndex) =>
                            <div key={`option${optionIndex}`}>
                              <InputGroup className={optionIndex + 1 < options.length ? 'mb-3' : ''} size="sm">
                                <Input
                                  type="text"
                                  name={`question${questionIndex}-option${optionIndex}`}
                                  placeholder={`Option ${optionIndex + 1}` }
                                  value={this.state.quiz.questions[questionIndex][`option${optionIndex + 1}`]}
                                  onChange={this.handleOption}
                                  invalid={submitted && !questions[questionIndex][`option${optionIndex + 1}`]}
                                />

                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <Input
                                      type="radio"
                                      name={`question${questionIndex}-option${optionIndex}-correct`}
                                      checked={this.state.quiz.questions[questionIndex].correctAnswer === (optionIndex + 1) ? 'checked' : ''}
                                      onChange={() => this.updateQuestion(questionIndex, 'correctAnswer', optionIndex + 1)}
                                      className="position-relative m-0"
                                      tabIndex="-1"
                                    />
                                  </InputGroupText>
                                </InputGroupAddon>
                              </InputGroup>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    </Fade>
                  )}

                  <FormGroup className="mt-3">
                    <Button color="secondary" onClick={this.addQuestion} block>Add question</Button>
                  </FormGroup>

                  <hr/>

                  <FormGroup className="mt-4 mb-0">
                    <Button color="success" disabled={submitting} block>
                      { submitting ? 'Creating your quiz...' : 'Create your quiz' }
                    </Button>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fade>
    );
  }
}

QuizFormPage.propTypes = {
  user: PropTypes.object,
  submitting: PropTypes.bool
};

const mapState = ({ session, quiz }) => ({
  user: session.user,
  submitting: quiz.submitting
});

export default connect(mapState)(QuizFormPage);