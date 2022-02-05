const express = require('express');
const url = require('url');
const StayContent = require('../models/stayContent');
const User = require('../models/user');
const StayHistory = require('../models/stayHistory');
const { render } = require('nunjucks');

const router = express.Router();

router.use((req, res, next) => {
    console.log('user : ' + typeof req.user);
    res.locals.user = req.user;

    next();
});

router.get('/', async (req, res, next) => {
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
            
            const staylist = await StayContent.findAll();
            const reservationlist = await StayHistory.findAll({ where: { guestUser: res.locals.user.id } });
            if(reservationlist)
            {
                console.log('>> reservationlist 데이터 없음');
            }
            if(staylist)
            {
                console.log('>> staylist 데이터 없음');
            }

            res.render('main',
            {
                title: title,
                stayinglist: staylist,
                reservationlist: reservationlist,
            });
        }
        else{
            res.render('main', { title: title });
        }

    } catch (err) {
        console.error(err);
        next(err);
    }

});


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

// router.get('/getStayingList', async (req, res, next) => {
//     try {
//         const staylist = await StayContent.findAll();
//         res.render('main', { stayinglist: staylist });
//     }
//     catch (err) {
//         console.error(err);
//         next();
//     }
// });

// router.get('/getList', async (req, res, next) => {
//     try {
//         const staylist = await StayContent.findAll();
//         const reservationlist = await StayHistory.findAll({ where: { guestUser: res.locals.user } });
//         if(reservationlist)
//         {
//             console.log('>> reservationlist 데이터 없음');
//         }
//         if(staylist)
//         {
//             console.log('>> staylist 데이터 없음');
//         }

//         console.log('reservationlist : ' + reservationlist);
//         res.render('main',
//             {
//                 stayinglist: staylist,
//                 reservationlist: reservationlist,
//             });
//     }
//     catch (err) {
//         console.error(err);
//         next();
//     }
// });

router.get('/reservation/:id', async (req, res, next) => {
    try {
        console.log('/reservation/:id >> ' + req.url);
        const words = req.url.split('/');
        
        //console.log('req.body.content : ' + req.body.content);
        console.log(` >> find StayContent id : ${words[words.length - 1]}`);
        const staying = await StayContent.findOne({ where: { hostUser: words[words.length - 1] } });
        const reservationlist = await StayHistory.findAll({ where: { hostUser: words[words.length - 1] } });

        console.log(`Title ${staying.Title}, Content ${staying.Content}, Hostuser ${staying.HostUser}`);

        if (staying) {

            //res.locals.stayHostuser = words[words.length-1];
            req.app.locals.stayHostuser = words[words.length - 1];

            res.render('reservation', {
                title: staying.Title,//req.body.title,
                content: staying.Content,//req.body.content,
                hostuser: staying.HostUser,//req.body.hostuser,
                reservationlist: reservationlist,
            });
        } else { // 데이터 없음
            res.write(`<script>alert('Stay 정보를 찾을 수 없습니다.')</script>`);
            return res.write('<script>window.location=\"/\"</script>');
        }
    }
    catch (err) {
        console.error(err);
        next();
    }
});

router.get('/createStay', (req, res, next) => {
    res.render('createStay', { title: 'AirToy - 등록' });
});

router.post('/createStay', async (req, res, next) => {
    try {
        const staycontent = await StayContent.findOne({ where: { HostUser: res.locals.user.id } });
        if (staycontent) {
            console.log('update stay content');
            console.log(`title : ${req.body.title} , hostuser : ${res.locals.user.id}, content : ${req.body.content}`);
            StayContent.update({
                Title: req.body.title,
                HostUser: res.locals.user.id,
                Content: req.body.content,
            }, {
                where: { HostUser: res.locals.user.id }
            });
        } else {
            //const newcontent = req.body;
            console.log('create stay content');
            console.log(`title : ${req.body.title} , hostuser : ${res.locals.user.id}, content : ${req.body.content}`);
            StayContent.create({
                Title: req.body.title,
                HostUser: res.locals.user.id,
                Content: req.body.content,
            });
        }
    } catch (error) {
        console.error(error);
    }
    res.redirect('/');
    //res.render('main');
});

router.post('/doReservation', async (req, res, next) => {
    try {
        console.log(`hostUser ${req.app.locals.stayHostuser}, gusetUser${res.locals.user.id}, fromDate ${req.body.fromDate}, toDate ${req.body.toDate}`);
        console.log('req.app.locals.stayHostuser ' + req.app.locals.stayHostuser);

        //const stayContent = await StayContent.findOne({where:{HostUser : req.app.locals.stayHostuser }});


        StayHistory.create({
            hostUser: req.app.locals.stayHostuser,//stayContent.hostUser,
            guestUser: res.locals.user.id,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
        });

        res.redirect('/getList');
    }
    catch (error) {
        console.error(error);
        next();
    }
});

module.exports = router;