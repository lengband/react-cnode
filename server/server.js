const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
// 因为 ssr 的 webpack.config.server.js 采用的 libraryTarget 是 commonjs2，它是 export default, 而 require 这种方式是引入整个文件，所以要加上 default
const app = express()

const isDev = process.env.NODE_ENV === 'development'


if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', appString))
  })
} else { // 开发环境
  const devStatic = require('./util/dev-static')
  devStatic(app)
}


app.listen(3333, () => {
  console.log('server is listening on 3333')
})