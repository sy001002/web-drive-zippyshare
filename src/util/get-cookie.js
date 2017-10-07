/**
 * @param {object} headers
 * @return {string}
 */
function getCookie(headers) {
	const setCookieList = headers['set-cookie']
	if( !Array.isArray(setCookieList) )
		return null

	for(const setCookie of setCookieList) {
		const result = (/JSESSIONID\s*=\s*([^;]+)/).exec(setCookie)
		if( result )
			return `JSESSIONID=${result[1]}`
	}
}

module.exports = getCookie
