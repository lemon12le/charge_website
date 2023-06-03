const { defineConfig } = require('@vue/cli-service')

let proxyObj = {}
proxyObj['/'] = {
    // websocket
    ws: false,
    // 目标地址
    target: 'http://10.117.239.173:8080/',
    // 发送请求头host会被设置target
    changeOrigin: true,
    // 不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '10.128.198.11',
    port: 8080,
    proxy:proxyObj
  }
})
