export const handleResponse = (response) => response.data;

export const handleError = (error) => {
  if (error.response) {
    const { message } = error.response.data;
    return Promise.reject(message);
  }
  return Promise.reject(error);
};