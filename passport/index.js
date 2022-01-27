const passport = require('passport');
const local = require('./localStrategy');
// const kakao = require('./passport-kakao');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {    // 로그인 시 호출된다. req.session 객체에 어떤 데이터를 저장할 지 정하는 메서드이다.
        console.log('> serializeUser');
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log(' deserializeUser');
        //done(null, id);
        User.findOne({ where: { id } })
            .then(user => done(null, user))   // req.user에 저장
            .catch(err => done(err));
    });

    local();
    // kakao();
};