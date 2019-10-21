import * as types from './mutation-types';
import apiUnsplash from '../services/apiUnsplash'
import axios from 'axios'

export const getEmojis = () => {
  return axios.get('/static/json/emoji.json')
    .then(res => {
      return res.data
    })
    .catch(e => console.log(e))
}

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
export const triggeringDownloadEndpoint = ({ }, endpoint) => {
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


