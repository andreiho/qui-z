import axios from 'axios';
import { handleResponse, handleError } from '../helpers/auth';

const getAll = () => {
  return axios.get('/api/quiz').then(handleResponse).catch(handleError);
};

const getBySlug = (slug) => {
  return axios.get(`/api/quiz/${slug}`).then(handleResponse).catch(handleError);
};

const create = (quiz) => {
  return axios.post('/api/quiz', quiz).then(handleResponse).catch(handleError);
}

const _delete = (id) => {
  return axios.delete(`/api/quiz/${id}`).then(handleResponse).catch(handleError);
};

const submitResponse = (quiz, response) => {
  return axios.post(`/api/quiz/${quiz}/response`, response).then(handleResponse).catch(handleError);
};

export const quizService = {
  getAll,
  getBySlug,
  create,
  delete: _delete,
  submitResponse
};