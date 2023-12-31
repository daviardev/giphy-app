import axios from 'axios'

const axiosParams = {
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '/'
}

const axiosInstance = axios.create(axiosParams)

const didAbort = err => axios.isCancel(err)

const getCancelSRC = () => {
  axios.CancelToken.source()
}

const withAbort = fn => async (...args) => {
  const originalConfig = args[args.length - 1]
  const { abort, ...config } = originalConfig

  if (typeof abort === 'function') {
    const { cancel, token } = getCancelSRC()
    config.cancelToken = token
    abort(cancel)
  }
  try {
    return await fn(...args.slice(0, args.length - 1), config)
  } catch (err) {
    didAbort(err) && (err.aborted = true)
    console.error(err)
    throw err
  }
}

const api = axios => {
  return {
    get: (url, config = {}) => withAbort(axios.get)(url, config),
    post: (url, body, config = {}) => withAbort(axios.post)(url, body, config),
    put: (url, body, config = {}) => withAbort(axios.put)(url, body, config),
    patch: (url, body, config = {}) => withAbort(axios.patch)(url, body, config),
    delete: (url, config = {}) => withAbort(axios.delete)(url, config)
  }
}

export default api(axiosInstance)
