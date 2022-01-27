const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    console.log('> localStrategy');
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email, password, done) => {
        console.log('> localStrategy.authenticate의 callback');
        try {
            const exUser = await User.findOne({ where: { email } });
            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 맞지 않습니다.' });
                }
            } else {
                done(null, false, { message: '해당 아이디가 존재하지 않습니다.' });
            }
        }
        catch (error) {
            console.error(error);
            done(error);
        }
    }));
};