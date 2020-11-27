const { MVLoaderBase } = require('mvloader')
const Redis = require('ioredis')

/**
 * @typedef {Object} redisSetParams
 * @property {string} key
 * @property {any} value
 * @property {int|string} [ex]
 * @property {int|string} [px]
 * @property {int|boolean} [nx]
 * @property {int|boolean} [xx]
 * @property {int|boolean} [xx]
 * @property {int|boolean} [keepTtl]
 * @property {int|boolean} [get]
 */
/**
 * @class Redis controller with base functionality
 * @property {Object.<import('ioredis)>} Redis
 */
class mvlRedisHandler extends MVLoaderBase {
  constructor (App, config = {}) {
    const defaults = {
      host: 'localhost',
      port: 6379,
      password: '',
      family: 4,
      db: 0
    }
    super(defaults, config)
    this.App = App
    this.MT = this.App.MT
    /** @param {Redis} */
    this.Redis = new Redis(this.config)
    // console.log(this.Redis)

    /** @function
     *
     * @param {redisSetParams} key
     * @param {any} value
     */
    this.set = (key, value = undefined) => {
      let params = [key, value]
      if (typeof key === 'object') {
        const options = key
        params = [options.key, options.value]
        if (options.ex) params.push('EX', options.ex)
        if (options.px) params.push('PX', options.px)
        if (options.nx) params.push('NX')
        if (options.xx) params.push('PX')
        if (options.get) params.push('GET')
        if (options.keepTtl) params.push('KEEPTTL')
      }
      this.Redis.set(...params)
    }
    this.get = (key) => this.Redis.get(key)
    this.del = (key) => this.Redis.del(key)
    this.ttl = (key) => this.Redis.ttl(key)
    this.pub = (key, value) => this.Redis.publish(key, value)
    this.sub = (key, value) => this.Redis.subscribe(key, value)
    this.pexp = (key, ttl) => this.Redis.pexpire(key, ttl)
    this.keys = (mask) => this.Redis.keys(mask)
    this.isset = async (key) => (await this.get(key)) !== null
  }
}

module.exports = mvlRedisHandler
