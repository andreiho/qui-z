import { sessionService } from 'redux-react-session';

import { quizConstants } from '../constants/quizConstants';
import { quizService } from '../services/quizService';
import { alertActions } from '../actions/alertActions';
import history from '../helpers/history';

const getAll = () => {
  const request = () => ({ type: quizConstants.GETALL_REQUEST });
  const success = quizzes => ({ type: quizConstants.GETALL_SUCCESS, quizzes });
  const failure = error => ({ type: quizConstants.GETALL_FAILURE, error });

  return dispatch => {
    dispatch(request());

    quizService.getAll()
      .then(quizzes => dispatch(success(quizzes)))
      .catch(error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  }
}

const getBySlug = (slug) => {
  const request = (slug) => ({ type: quizConstants.GET_REQUEST, slug });
  const success = (quiz) => ({ type: quizConstants.GET_SUCCESS, quiz });
  const failure = (error) => ({ type: quizConstants.GET_FAILURE, error });

  return dispatch => {
    dispatch(request(slug));

    quizService.getBySlug(slug)
      .then(quiz => dispatch(success(quiz)))
      .catch(error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  }
}

const create = (quiz) => {
  const request = (quiz) => ({ type: quizConstants.CREATE_REQUEST, quiz });
  const success = (quiz) => ({ type: quizConstants.CREATE_SUCCESS, quiz });
  const failure = (error) => ({ type: quizConstants.CREATE_FAILURE, error });

  return dispatch => {
    dispatch(request(quiz));

    quizService.create(quiz)
      .then(newQuiz => {
        dispatch(success(newQuiz));
        history.push(`/quiz/${newQuiz.slug}`);
        dispatch(alertActions.success(`${quiz.name} was created successfully.`));
      })
      .catch(error => {
        dispatch(failure(error));
        dispatch(alertActions.error(error));
      });
  }
}

const _delete = (id) => {
  const request = (id) => ({ type: quizConstants.DELETE_REQUEST, id });
  const success = (id) => ({ type: quizConstants.DELETE_SUCCESS, id });
  const failure = (id, error) => ({ type: quizConstants.DELETE_FAILURE, id, error });

  return dispatch => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      dispatch(request(id));

      quizService.delete(id)
        .then(() => {
          dispatch(success(id));
          dispatch(alertActions.success('Quiz deleted successfully.'));
        })
        .catch(error => dispatch(failure(id, error)));
    }
  }
}

const submitResponse = (quiz, response) => {
  const request = (quiz) => ({ type: quizConstants.RESPONSE_REQUEST, quiz });
  const success = (fullResponse) => ({ type: quizConstants.RESPONSE_SUCCESS, fullResponse });
  const failure = (error) => ({ type: quizConstants.RESPONSE_FAILURE, error });

  return dispatch => {
    dispatch(request(quiz));

    quizService.submitResponse(quiz, response)
      .then(fullResponse => {
        dispatch(success(fullResponse));

        let totalCorrect = 0;
        fullResponse.answers.forEach(item => {
          if (item.answer === item.question.correctAnswer) {
            totalCorrect++;
          }
        });

        window.scrollTo(0, 0);
        dispatch(alertActions.success(`Thank you. You answered correctly to ${totalCorrect} questions.`));
      })
      .catch(error => dispatch(failure(error)));
  };
};

export const quizActions = {
  getAll,
  getBySlug,
  create,
  delete: _delete,
  submitResponse
};