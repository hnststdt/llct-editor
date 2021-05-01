import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/app'
import store from './store/index'

import './styles/index.scss' // Global Style

render(
  // redux를 사용하기 위해 Provider component로 감쌉니다.
  // react-router-dom과 같은 타 컴포넌트를 사용하려면
  // Provider 하위 컴포넌트에 <App>을 감싸는 형태로 추가하시면 됩니다.
  // 페이지에서 사용할 일반적인 컴포넌트들은 <App> 안에다 정의하면 되겠습니다.
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
