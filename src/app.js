const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const morgan = require('morgan');

const indexRouter = require('../routes');
const authRouter = require('../routes/auth');
const { sequelize } = require("../models");
const passportConfig = require('../passport');
const passport = require('passport');

/* config() 에서 경로 문제 발생하므로 직접 입력 필요 */
console.log('process.cwd() : ', process.cwd());      // 현재 작업 디렉토리
console.log('__dirname : ', __dirname);              // 현재 모듈 js 디렉토리 
//dotenv.config();
dotenv.config({ path: `${__dirname}/.env` });

const app = express();

passportConfig();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,    // HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링 함
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터 베이스 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(morgan('dev'));                                     // Nodejs 에서 사용되는 log 관리 미들웨어
app.use(express.urlencoded({ extended: false }));           // 클라이언트에서 전송한 데이터 중 body 부분을 pasing해준다.
console.log('process.env.COOKIE_SECRET : ', process.env.COOKIE_SECRET);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);

// indexRouter 사용하기 위해 app.get('/', ...) 주석 처리
// app.get('/', (req, res, next) => {
//     console.log("Hello");
//     res.send('Hello Localhost');
//     //next();       // error
//     /*
//         [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
//         주의 : res.응답메서드 는 한번만 호출 가능하므로 res.send 사용 후 next() 메서드 호출하면 오류남
//     */
// });



app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    if (err) {
        console.log(err);
        res.locals.message = err.message;
        res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
        res.status(err.status || 500);
        res.render('error');
    }
});

app.listen(app.get('port'), () => {
    //console.log(process.env.PORT);
    console.log(app.get('port'), ' 포트에서 대기중');
});