import * as types from './mutation-types';
import apiUnsplash from '../services/apiUnsplash'

export const getRandomImage = ({ }, query) => {
  return new Promise((resolve, reject) => {
    apiUnsplash
      .get('/photos/random', {
        params: {
          query: query
        }
      })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
};
export const getDownloadUrl = ({ }, endpoint) => {
  return new Promise((resolve, reject) => {
    apiUnsplash
      .get(endpoint)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
};


