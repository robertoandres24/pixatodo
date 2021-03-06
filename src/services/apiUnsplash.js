import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Accept-Version': 'v1'
  }
})
api.defaults.params = {}
api.defaults.params['client_id'] = process.env.UNSPLASH_KEY

export default api
