const webDriveUtil = require('web-drive-util')
const getBaseUrl = require('./util/get-base-url')
const getCookie = require('./util/get-cookie')
const getFilename = require('./util/getFilename')

/**
 * @typedef {object} result
 * @property {string} url
 * @property {string} filename
 * @property {string} cookie
 * @property {string} range - 'bytes'
 */

/**
 * @param {string} url
 * @param {object} opts
 * @param {number} opts.timeout - default to 30000
 * @param {number} opts.requestDelay - default to 3000
 * @return {result}
 */
async function fetchMeta(url, opts) {
	opts = opts || {}
	opts.timeout = opts.timeout || 30000
	opts.requestDelay = opts.requestDelay || 3000

	const baseUrl = getBaseUrl(url)
	if( !baseUrl )
		throw 'invalid url'

	let res = await webDriveUtil.followLocation(url, {
		timeout: opts.timeout,
		requestDelay: opts.requestDelay,
	})

	if( !res.ok )
		throw webDriveUtil.makeError(res, url, url, {}, 'status code is not ok')

	let body = await res.text()

	const cookie = getCookie(res.headers)
	if( !cookie )
		throw webDriveUtil.makeError(res, url, url, {}, 'can not get cookie')

	const filename = getFilename(baseUrl, body)
	if( !filename )
		throw webDriveUtil.makeError(res, url, url, {}, 'can not get js code inside web page')

	return webDriveUtil.makeResult(
		filename.url,
		filename.filename,
		cookie,
		true
	)
}

module.exports = fetchMeta
