import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pixabay.com/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})
api.defaults.params = {}
api.defaults.params['key'] = process.env.PIXABAY_KEY

export default api
