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