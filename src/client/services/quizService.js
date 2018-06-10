import { handleResponse, getRequestOptions } from '../helpers/auth';

const getAll = () => {
  const requestOptions = getRequestOptions('GET');
  return fetch('/api/quiz', requestOptions).then(handleResponse);
};

const getBySlug = (slug) => {
  const requestOptions = getRequestOptions('GET');
  return fetch(`/api/quiz/${slug}`, requestOptions).then(handleResponse);
};

const create = (quiz) => {
  const requestOptions = {
    ...getRequestOptions('POST'),
    body: JSON.stringify(quiz)
  };

  return fetch('/api/quiz', requestOptions).then(handleResponse);
}

const _delete = (id) => {
  const requestOptions = getRequestOptions('DELETE');
  return fetch(`/api/quiz/${id}`, requestOptions).then(handleResponse);
};

const submitResponse = (quiz, response) => {
  const requestOptions = {
    ...getRequestOptions('POST'),
    body: JSON.stringify(response)
  };

  return fetch(`/api/quiz/${quiz}/response`, requestOptions).then(handleResponse);
};

export const quizService = {
  getAll,
  getBySlug,
  create,
  delete: _delete,
  submitResponse
};