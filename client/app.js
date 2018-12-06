import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App.jsx'

// 生产环境(如果开发环境用这个，react-dom 会报警告 -> react-dom.development.js:506 Warning: Expected server HTML to contain a matching <div> in <div>.)
// ReactDOM.hydrate(<App />, document.getElementById('root')) // 服务端渲染官方推荐 hydrate 替换 render，它会比较代码，如果发现服务端代码和客户端代码不一致，会采用最新客户端代码。
// 开发环境
// ReactDOM.render(<App />, document.getElementById('root'))

const root = document.getElementById('root')
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx').default
    render(NextApp)
  })
}