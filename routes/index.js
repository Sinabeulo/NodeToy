const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log('인덱스 라우터 In');
    res.render('index');
});

module.exports = router;