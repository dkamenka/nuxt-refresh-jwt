const { resolve } = require('path')
const merge = require('lodash/merge')

const defaults = {
  endpoint: { url: '/auth/refresh', method: 'get' },
  interval: 10 * 60, // 10 minutes
  tokenField: 'token'
}

module.exports = function (moduleOptions) {
  const options = merge({}, defaults, moduleOptions, this.options.refreshJWT)

  const { dst } = this.addTemplate({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'refresh-jwt.js',
    options
  })

  this.options.plugins.push(resolve(this.options.buildDir, dst))
}
