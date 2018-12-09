import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import App from './views/App'
import appState from './store/app-state'

/*
 生产环境(如果开发环境用这个，react-dom 会报警告
 Warning: Expected server HTML to contain a matching <div> in <div>.)

 ReactDOM.hydrate(<App />, document.getElementById('root'))
 服务端渲染官方推荐 hydrate 替换 render，它会比较代码，如果发现服务端代码和客户端代码不一致，会采用最新客户端代码。

 开发环境
 ReactDOM.render(<App />, document.getElementById('root'))
*/

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Provider appState={appState}>
          <Component />
        </Provider>
      </BrowserRouter>
    </AppContainer>,
    root,
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App.jsx').default
    render(NextApp)
  })
}
