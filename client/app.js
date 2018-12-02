import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.hydrate(<App />, document.getElementById('root')) // 服务端渲染官方推荐 hydrate 替换 render，它会比较代码，如果发现服务端代码和客户端代码不一致，会采用最新客户端代码。
// ReactDOM.render(<App />, document.getElementById('root'))