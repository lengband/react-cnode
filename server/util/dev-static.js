const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')
const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Moudle = module.constructor

const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFs
let serverBundle
serverCompiler.outputFileSystem = mfs

serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Moudle()
  m._compile(bundle, 'server-entry.js') // 指定创建出来的 module 的名称
  serverBundle = m.exports.default
})

module.exports = app => {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', (req, res) => {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}