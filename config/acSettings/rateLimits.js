/**
 * throttleLimit: number of calls after which throttling starts, if 0 no throttling is used
 * expires: number of seconds before the rate limiter resets
 * delay: milliseconds to delay throttled calls
 * limit: number of calls before the rate limiter starts blocking
 */
module.exports.rateLimits = {
  debugMode: false,
  attackers: {}
}
