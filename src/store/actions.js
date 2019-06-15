import * as types from './mutation-types';
import api from '../services/api'

export const getApiImages = ({ commit }, cat) => {
  return new Promise((resolve, reject) => {
    api
      .get('/', {
        params: {
          per_page: 200,
          category: cat
        }
      })
      .then(response => {
        resolve(response.data.hits)
        // commit('set_images', response.data.hits);
      })
      .catch(error => {
        reject(error)
      })
  })
};
