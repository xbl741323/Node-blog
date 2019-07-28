var express = require('express')
var fs = require('fs')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router.js')

app.engine('html', require('express-art-template'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))
// 在 Node 中，有很多的第三方模板引擎可以使用，不是只有 art-template
// ejs、jade(pug)、handlebars、nunjucks
app.set('views',path.join(__dirname,'./views/'))// 默认就是 ./views 目录
app.get('/', function (req, res) {
    res.render('index.html')
})
app.use(router)

app.listen(3300, function () {
    console.log('Server is running ... ')
})