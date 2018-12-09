# Webpack
1、(2.3)`webpack`默认会`build` `src/index.js`，如果想`build`其他文件，`webpack [<entry>]`，如果有config文件，可以`webpack <entry> --config <config>`，如果指定出口位置`webpack <entry> --config <config> -o <output>`，`webpack -h`会有帮助文档，[官方文档](:https://webpack.js.org/api/cli/)，不过通常的做法是将脚本语句放在`package.json`里面去执行，如：`"build": "webpack --config build/webpack.config.js"`

2、(2.4)使用 babel7(`@babel/core`)的时候，与其相关的插件要升级成 @babel 这种形式，除了`babel-loader`外，如：`@babel/preset-env`, `@babel/preset-react`, `html-webpack-plugin`的作用是使`index.html`能够自动引入`build`后的文件hash，并且在`dev`环境下会自动打开浏览器，在根目录render的时候，即使没用到`react`，也要引入，如：
```
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(<App />, document.body)
```
原因是当写入 `<App />`时，他是 jsx, 实际上是它会把`<App>`传递给`react.createElement`当着参数的。


3、(2.5) 服务端渲染

思路：
> 1、准备 客户端(client)和服务端(server)的webpack配置文件
> 2、client 配置主要负责生成 index.html(根据template.html)和 app[hash].js(打包主要代码)
server配置负责将`app.jsx`作为入口打包到`dist`里面的的`server-entry.js`(打包根节点的代码`App.jsx`)
> 3、将`dist/server-entry.js`变成 `string`，替换`dist/index.html`里面定义好的元素(`<app></app>`)，然后将整个`index.html`返回

总结：
> 正常打包客户端代码，将`App.jsx`根元素部分用`server`端生成的代码替换。实现了由`html(根元素)+app.js` -> `html(页面)+app.js`

2.6 Webpack-dev-server配置
webpack-dev-server 开启node服务，把文件存在内存中(文件内容发生变化，浏览器自动刷新)
hot module replacement 热更替(页面不刷新)
`webpack-dev-server`的配置是`devServer`, [文档](https://webpack.docschina.org/configuration/dev-server/#devserver)
`contentBase`的意思是在哪个目录下开启`node`服务，但是这个目录不一定是真实的物理地址，它只是在内存的地址。但是如果一样的路径下有真实的目录存在，`webpack`默认取物理地址下的目录。(所以写完devServer的配置最好删除一下`dist`目录)
`devServer`的`publicPath`和`output`的`publicPath`路径要一致，他们都表示静态资源的访问位置。(可以理解为`webpack`在内存中生成一个`dist`目录，`dist`中的静态资源(如: `app.[hash].js`)在`/public`的访问路径下面。)，用于区分静态资源请求和API请求。
`historyApiFallback`表示任意的404响应都可能需要被替代为 index.html。

2.7 hot-module-replacement
1、在`.babelrc`里面添加
```
 "plugins": [ "react-hot-loader/babel" ]
 ```
 2、`devServer`中的 `hot: true`打开
 3、在`webpack.config.js` 添加 `react-hot-loader/patch`
 ```
 'react-hot-loader/patch', // RHL patch
  path.join(__dirname, '../client/app.js') // Your appʼs entry point
 ```
 4、用`AppContainer`包裹根节点
```
import React from 'react';
import ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader';
import RootContainer from './containers/rootContainer';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
}

render(RootContainer);

if (module.hot) {
  module.hot.accept('./containers/rootContainer.js', () => {
    const NextRootContainer = require('./containers/rootContainer').default;
    render(NextRootContainer);
  });
}
```
坑：不要在 `package.json` 的 `webpack-dev-server`中加上`--hot`（亲测：加了之后热加载不生效）
react-hot-loader [文档](http://gaearon.github.io/react-hot-loader/getstarted/#step-2-of-3-using-hmr-to-replace-the-root-component)

2-8 开发时的服务端渲染(既：当没有`dist`目录时的服务端渲染)
启动命令：yarn dev:server
执行文件：server/util/dev-static.js
思路：
> 1、将 webpack.config.server 配置打包编译
> 2、引入 memoryfs, 在内存中读取出口文件，并打包成一个 bundle
> 3、将 /public 的静态请求代理回 dev:client 的 /public 路径
> 4、将 模板 内容替换成在内存中打包出来的文件(server-entry.js)

2.9
> webpack-merge 将相同配置出来放在 base 里面
> husky：Husky can prevent bad git commit, git push
> serve-favicon 将 /favicon 配置到 本地 ico
> nodemon 监听 server 文件自启动（配置文件：nodemon.json）
