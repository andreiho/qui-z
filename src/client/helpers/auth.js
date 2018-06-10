export const handleResponse = (response) => {
  return response.json().then(data => {
    if (!response.ok) {
      const error = data && data.message || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
};

export const getRequestOptions = (method = 'GET', includeCredentials = true) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  credentials: includeCredentials ? 'include' : 'omit'
});