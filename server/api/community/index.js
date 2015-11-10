/**
 * Created by gx761 on 10/16/2015.
 */
'use strict';

var express = require('express');
var controller = require('./community.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();


router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/mcompany/:id', controller.showMcompanyInfo);



router.post('/', auth.hasRole('admin'),controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;