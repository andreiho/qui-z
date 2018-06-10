import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import {
  Card,
  CardTitle,
  CardBody,
  Form,
  FormGroup,
  Label,
  CustomInput,
  Button
} from 'reactstrap';

import { quizActions } from '../actions/quizActions';

class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: ''
    };

    this.handleRadioClick = this.handleRadioClick.bind(this);
  }

  handleRadioClick(option) {
    const { question } = this.props;

    this.setState({ selected: option });
    this.props.onOptionSelected(question._id, option);
  }

  render() {
    const { question, user, correctAnswer } = this.props;
    const { selected } = this.state;
    const options = [ question.option1, question.option2, question.option3, question.option4 ];
    const submitted = typeof correctAnswer !== 'undefined';
    const isCorrect = correctAnswer === selected;

    return (
      <Card className="mb-4" outline color={submitted && isCorrect ? 'success' : (submitted && !isCorrect ? 'danger' : '')}>
        <CardBody>
          <CardTitle tag="h5">{question.name}</CardTitle>

          <hr/>

          <FormGroup className="mb-0">
            { options.map((option, index) => {
                const key = index + 1;

                return (
                  <CustomInput
                    key={key}
                    type="radio"
                    name={`question-${question._id}-option`}
                    id={`question-${question._id}-option-${key}`}
                    label={option}
                    onClick={() => this.handleRadioClick(key)}
                    className={(submitted && correctAnswer === key) ? 'text-success' : (submitted && key === selected ? 'text-danger' : '')}
                  />
                );
              }
            )}
          </FormGroup>
        </CardBody>
      </Card>
    )
  }
}

QuestionCard.propTypes = {
  quiz: PropTypes.object,
  user: PropTypes.object
};

const mapState = ({ session }) => ({
  user: session.user
});

export default connect(mapState)(QuestionCard);