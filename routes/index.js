var express = require('express');
var request = require('request');
const hawk = require('hawk');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var multer = require('multer');
var path = require('path');
var router = express.Router();

router.get('/error', function(req, res, next) {
    res.render('error');
});

router.get('/', function(req, res, next) {
    res.redirect('index');
});
router.get('/index', function(req, res, next) {
    res.render('admin/bulk_upload');
});



module.exports = router;