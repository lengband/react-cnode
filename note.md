# Webpack
1、`webpack`默认会`build` `src/index.js`，如果想`build`其他文件，`webpack [<entry>]`，如果有config文件，可以`webpack <entry> --config <config>`，如果指定出口位置`webpack <entry> --config <config> -o <output>`，`webpack -h`会有帮助文档，[官方文档](:https://webpack.js.org/api/cli/)，不过通常的做法是将脚本语句放在`package.json`里面去执行，如：`"build": "webpack --config build/webpack.config.js"`
2、使用 babel7(`@babel/core`)的时候，与其相关的插件要升级成 @babel 这种形式，除了`babel-loader`外，如：`@babel/preset-env`, `@babel/preset-react`, `html-webpack-plugin`的作用是使`index.html`能够自动引入`build`后的文件hash，并且在`dev`环境下会自动打开浏览器，在根目录render的时候，即使没用到`react`，也要引入，如：
```
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(<App />, document.body)
```
原因是当写入 `<App />`时，他是 jsx, 实际上是它会把`<App>`传递给`react.createElement`当着参数的。