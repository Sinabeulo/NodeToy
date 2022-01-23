const express = require("express");

const app = express();
const nunjucks = require('nunjucks');

const indexRouter = require('../routes');

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,    // HTML 파일이 변경될 때 템플릿 엔진을 다시 렌더링 함
});

app.use('/', indexRouter);

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

// app.use('/', (error, req, res, next) => {
//     if (error) {
//         console.log(error.message);
//     }
// });

app.listen(app.get('port'), () => {
    //console.log(process.env.PORT);
    console.log(app.get('port'), ' 포트에서 대기중');
});