var express = require('express')
var router = express.Router()
var User = require('./models/user')
var md5 = require('blueimp-md5')

router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })

})
router.get('/login', function (req, res) {
    res.render('login.html')
})
router.post('/login', function (req, res) {
    var body = req.body
    User.findOne({
        $or: [
            { email: body.email },
            { password: md5(md5(body.password)) }
        ]
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: 'Internsl error'
            })
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid'
            })
        }
        console.log(user)
        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})
router.get('/register', function (req, res) {
    res.render('register.html')
})
router.post('/register', function (req, res) {
    // 1. 获取表单提交的数据 
    //    req.body
    // 2. 操作数据库
    //    判断用户是否存在
    //    如果不存在，注册新用户
    // 3. 发送响应
    var body = req.body
    User.findOne({
        $or: [
            { email: body.email },
            { nickname: body.nickname }
        ]
    }, function (err, data) {
        if (err) {
            return res.status(500).send('Server Error')
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname already exist'
            })
        }
        // 对密码进行 md5 重复加密
        body.password = md5(md5(body.password))
        new User(body).save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internsl error'
                })
            }
            // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user
            // Express 提供了一个响应方法：json
            // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串
            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        })

    })
})
router.get('/logout', function (req, res) {
    // 清除登陆状态
    req.session.user = null
    // 重定向到登陆页面
    res.redirect('/login')
})
router.get('/profile', function (req, res) {
    res.render('settings/profile.html', {
        user: req.session.user
    })
})
router.post('/profile', function (req, res) {
    var body = req.body
    var cuser = req.session.user
    var cnickname = body.nickname
    var cbio = body.bio
    var cgender = body.gender
    var cbirthday = body.birthday
    cuser.nickname = body.nickname
    cuser.bio = body.bio
    cuser.gender = body.gender
    cuser.birthday = body.birthday
    console.log(body)
    User.findOneAndUpdate({ email: cuser.email }, {
        nickname: cnickname,
        bio: cbio,
        gender: cgender,
        birthday: cbirthday
    }, function (err) {
        if (err) {
            return res.status(500).send('Server Error')
        }
    })
    res.redirect('/profile')
})
router.get('/admin', function (req, res) {
    res.render('settings/admin.html', {
        user: req.session.user
    })
})
router.post('/admin', function (req, res) {
    var body = req.body
    var cuser = req.session.user
    var cpassword = body.password
    cuser.password = cpassword
    User.findOneAndUpdate({ email: cuser.email }, { password: cpassword }, function (err) {
        if (err) {
            return res.status(500).send('Server Error')
        }
    })
    res.redirect('/logout')
})
router.get('/show', function (req, res) {
    res.render('topic/show.html', {
        user: req.session.user
    })
})
router.get('/new', function (req, res) {
    res.render('topic/new.html', {
        user: req.session.user
    })
})
module.exports = router