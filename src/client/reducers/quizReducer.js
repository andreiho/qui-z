

import { quizConstants } from '../constants/quizConstants';

export default (state = {}, action) => {
  switch (action.type) {
    // Create
    case quizConstants.CREATE_REQUEST:
      return { submitting: true };
    case quizConstants.CREATE_SUCCESS:
      return {};
    case quizConstants.CREATE_FAILURE:
      return { error: action.error };

    // Get all
    case quizConstants.GETALL_REQUEST:
      return { loading: true };
    case quizConstants.GETALL_SUCCESS:
      return { quizzes: action.quizzes };
    case quizConstants.GETALL_FAILURE:
      return { error: action.error };

    // Get single
    case quizConstants.GET_REQUEST:
      return { loading: true };
    case quizConstants.GET_SUCCESS:
      return { item: action.quiz };
    case quizConstants.GET_FAILURE:
      return { error: action.error };

    // Delete
    case quizConstants.DELETE_REQUEST:
      // Add deleting: true property to the quiz being deleted
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === action.id ? { ...quiz, deleting: true } : quiz
        )
      };
    case quizConstants.DELETE_SUCCESS:
      // Remove the deleted quiz from the state
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz._id !== action.id)
      };
    case quizConstants.DELETE_FAILURE:
      return {
        ...state,
        quizzes: state.quizzes.map(quiz => {
          if (quiz.id === action.id) {
            // Make a copy of the quiz, without the deleting: true property
            const { deleting, ...quizCopy } = quiz;
            // Return the copy of the quiz with the deleteError: error property
            return { ...quizCopy, deleteError: action.error };
          }
        })
      };

      // Submit response
      case quizConstants.RESPONSE_REQUEST:
        return { ...state, submitting: true };
      case quizConstants.RESPONSE_SUCCESS:
        return {
          ...state,
          correctAnswers: action.fullResponse.answers.reduce((output, item) => {
            output[item.question._id] = item.question.correctAnswer;
            return output;
          }, {})
        };
      case quizConstants.RESPONSE_FAILURE:
        return { ...state, error: action.error };
    default:
      return state
  }
}