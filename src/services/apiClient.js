import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://discourse-chat-07776d7da87a.herokuapp.com/',
});

apiClient.interceptors.request.use(config => {
  const rawTokens = localStorage.getItem('authTokens');
  if (rawTokens) {
    const { access } = JSON.parse(rawTokens);
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;