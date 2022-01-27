const express = require('express');
const url = require('url');
const qs = require('querystring');

const router = express.Router();

// router.get('/', (req, res, next) => {
//     console.log('인덱스 라우터 In');
//     res.render('index');
// });
router.use((req, res, next) => {
    console.log('user : ' + typeof req.user);
    res.locals.user = req.user;

    next();
});

router.get('/', (req, res, next) => {
    try {
        if (req.url.startsWith('/?loginError')) {
            const { query } = url.parse(req.url);
            res.write(`<script>alert('${query}')</script>`);
            return res.write('<script>window.location=\"/\"</script>');     // 자바스크립트 사용하여 메인 화면으로 이동
            // res.message = query;
            // return res.redirect('/error');
        }

        console.log('GET /index.js');
        let title = 'AirToy - Login';
        
        if (res.locals.user) {
            console.log('title changed');
            title = 'AirToy - Home';
        } 

        res.render('main', {title : title});
    } catch (err) {
        console.error(err);
        next(err);
    }

});

// router.get('/error',(req,res,next)=>{
//     res.write(`<script>alert('${res.message}')</script>`);
//     return res.write('<script>window.location=\"/\"</script>');
// });

router.get('/join', (req, res, next) => {
    try {
        const { query } = url.parse(req.url);
        console.log(typeof query);

        if (query && query.includes('error')) {
            res.write(`<script charset="utf-8">alert('이미 존재하는 회원입니다.')</script>`);
            return res.write('<script>window.location=\"/join\"</script>');
        }


        res.render('join');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;