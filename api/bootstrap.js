const _ = require('lodash')
const util = require('util')

const acbRedis = require('ac-bootstrap-redis')
const acrl = require('ac-ratelimiter')



module.exports.bootstrapAsync = async() => {

	const initRedis = async() => {
		const acbRedisAsync = util.promisify(acbRedis)
		await acbRedisAsync(acapi, { bootstrapping: true })
	}

	const rateLimiter = () => {
		let rateLimiterOptions = {
				routes: _.get(acapi.config, 'rateLimits.routes', []),
				logger: acapi.log,
				knownIPs: acapi.config.knownIPs,
				ignorePrivateIps: acapi.config.environment !== 'test'
		}
		acapi.rateLimiter = new acrl(rateLimiterOptions)
		acapi.aclog.listing({ field: 'Rate Limiter', value: 'Activated' })
		_.forEach(_.get(acapi.config, 'rateLimits.routes', []), route => {
				acapi.aclog.listing({ field: 'Route', value: _.get(route, 'route') })
				acapi.aclog.listing({ field: 'Limit', value: _.get(route, 'limit') })
				acapi.aclog.listing({ field: 'Expires', value: _.get(route, 'expires') })
		})
	}

	const shutdownBehaviour = () => {
		process.once('SIGTERM', () => {
			acapi.log.warn('Received SIGTERM - shutdown Bull queues')
			acapi.bull.shutdown(err => {
				if (err) acapi.log.warn('Received SIGTERM - Bull shutdown failed | %j', err)
				acapi.log.warn('Received SIGTERM - exiting process now')
				process.exit()
			})
		})
	}

	await initRedis()
	await rateLimiter()
	await shutdownBehaviour()

}