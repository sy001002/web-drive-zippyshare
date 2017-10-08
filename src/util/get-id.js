/**
 * @param {string} url
 * @return {string}
 */
function getId(url) {
	const result = (/^http:\/\/www[0-9]*\.zippyshare\.com\/v\/([^\/]+)\/file\.html/).exec(url)

	if( result )
		return result[1]
}

module.exports = getId
