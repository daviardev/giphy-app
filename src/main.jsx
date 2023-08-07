import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { $ } from '../src/utils/dom'

import './index.css'

ReactDOM.createRoot($('#root')).render(
  <React>
    <App />
  </React>
)
