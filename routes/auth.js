const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => {
    console.log('> called : routes/auth/login');
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            console.log('>> !user');
            return res.redirect(`/?loginError=${info.message}`);
        }

        // console.log('> auth/login user data: ',user);
        // console.log('> auth/login typeof user: ', typeof user);

        return req.login(user, (loginError) => {     // serializeUser 호출
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);   // 미들웨어 내의 미들웨어에는 (req,res,next)를 붙입니다.
});

router.post('/logout', isLoggedIn, (req, res, next) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/');
});

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    console.log('> called : routes/auth/join');

    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            password: hash,
            nick,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }

    //passport.authenticate('local')
});

/* 다음과 같은 에러 발생 가능함. localhost에서 리디렉션한 횟수가 너무 많습니다. */
// router.get('/join', isNotLoggedIn, async(req,res,next)=>{
//     console.log('> called GET : routes/auth/join');

//     const urlContent = url.parse(req.url);
//     const query = qs.parse(urlContent);

//     console.log('urlContent ', urlContent);
//     console.log('query ', query);

//     return res.redirect('/auth/join');
// });


module.exports = router;