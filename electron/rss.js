const Parser = require('rss-parser')
const parser = new Parser()

const parseUrl = async (url) => {
  const feed = await parser.parseURL(url)
  return feed
}

// export functions here
module.exports = {
  parseUrl
}
