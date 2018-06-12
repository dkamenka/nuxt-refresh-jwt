import Auth from './auth/auth'

const refresh = {
  refreshTokenOptions: <%= JSON.stringify(options) %>,

  fetchUserOnce () {
    const strategy = this.strategy
    if (this.getToken(strategy.name)) {
      if (!this.$state.user) {
        return this
          .refresh()
          .then(() => this.fetchUser(...arguments))
      }
    }
    return Promise.resolve()
  },

  refresh () {
    const strategy = this.strategy
    if (this.getToken(strategy.name)) {
      return this
        .refreshRequest()
        .then(newToken => {
          const tokenWithType = 'Bearer ' + newToken
          this.setToken(strategy.name, tokenWithType)
          strategy._setToken(tokenWithType)
        })
    }
    return Promise.resolve()
  },

  refreshRequest () {
    return this.ctx.app.$axios
      .request(this.refreshTokenOptions.endpoint)
      .then(response => {
        return response.data[this.refreshTokenOptions.tokenField]
      })
      .catch(error => {
        this.callOnError(error, { method: 'fetchUser' })
        return Promise.reject(error)
      })
  }
}

Object.assign(Auth.prototype, refresh)

export default function (ctx, inject) {
  const auth = ctx.app.$auth

  setInterval(auth.refresh.bind(auth), auth.refreshTokenOptions.interval * 1000)
}
