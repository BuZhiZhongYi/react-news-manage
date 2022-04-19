import React from 'react'
import IndexRouter from './router/indexRouter'
import { Provider } from 'react-redux'
import './App.css'
import store from './redux/store'
export default function App() {
  return (
    // <Provider store={store}>
    <IndexRouter />
    // {/* </Provider> */ }
  )
}
