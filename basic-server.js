
var fs = require('fs')

var React = require('react')
var renderToString = require('react-dom/server').renderToString
var ReactHTMLTree = require('./react-htmltree.js')


var tree = React.createElement(ReactHTMLTree, {
  source: '<body><h2>ReactHTMLTree</h2> <a href="http://github.com/autarc/react-htmltree">Repository</a></body>'
})

var html = renderToString(tree)

console.log(html);

fs.writeFile(__dirname + '/basic-server-generated.html', html)
