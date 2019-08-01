import * as types from './mutation-types';
import api from '../services/api'
import apiUnsplash from '../services/apiUnsplash'

export const getApiImage = ({ commit }, { category = '', page = 1, per_page = 3 }) => {
  return new Promise((resolve, reject) => {
    api
      .get('/', {
        params: {
          category,
          page,
          per_page
        }
      })
      .then(response => {
        resolve(response.data.hits[0])
        // commit('set_images', response.data.hits);
      })
      .catch(error => {
        reject(error)
      })
  })
};
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

