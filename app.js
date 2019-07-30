var express = require('express')
var fs = require('fs')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var router = require('./router.js')
var session = require('express-session')

app.engine('html', require('express-art-template'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/public/', express.static(path.join(__dirname, './public/')))
// 在 Node 中，有很多的第三方模板引擎可以使用，不是只有 art-template
// ejs、jade(pug)、handlebars、nunjucks
app.set('views',path.join(__dirname,'./views/'))// 默认就是 ./views 目录

// 在 Express 这个框架中，默认不支持 Session 和 Cookie
// 但是我们可以使用第三方中间件：express-session 来解决
// 1. npm i express-session
// 2. 配置
// 3. 使用
//  当把这个插件配置好后，我们就可以通过 req.session 来访问和设置 Session成员了
//  添加 Session 数据：req.session.foo = 'bar'
//  访问 Session 数据：req.session.foo
app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
  }))

app.use(router)

app.listen(3300, function () {
    console.log('Server is running ... ')
})