const cheerio = require('cheerio')
const safeEval = require('safe-eval')

/**
 * @param {string} body
 * @return {string}
 */
function getJsCode(body) {
	const $ = cheerio.load(body)
	const scriptList = $('script')

	for(let i = 0; i < scriptList.length; i++) {
		const { children } = scriptList[i]
		if( !Array.isArray(children) )
			continue

		for(let j = 0; j < children.length; j++) {
			const { data } = children[j]
			if(typeof data !== 'string')
				continue

			if((/document\s*\.\s*getElementById\s*\(\s*'dlbutton'\s*\)\s*\.\s*href\s*=/).test(data))
				return data
		}
	}
}

/**
 * @typedef {object} result
 * @property {string} url
 * @property {string} filename
 */

/**
 * @param {string} baseUrl
 * @param {string} body
 * @return {result}
 */
function getFilename(baseUrl, body) {
	const jsCode = getJsCode(body)
	if( !jsCode )
		return null

	const context = {
		document: {
			getElementById: id => {
				if( id === 'dlbutton' )
					return context.result
				else
					return {}
			},
		},
		result: {},
	}

	try {
		safeEval(jsCode, context)
	} catch(err) {
		return null
	}

	if( !context.result.href )
		return null

	const url = baseUrl + context.result.href
	let filename = (/([^\/]+)\/?$/).exec(url)
	if( !filename )
		return null

	filename = decodeURIComponent(filename[1])

	return { url, filename }
}

module.exports = getFilename
