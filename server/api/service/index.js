'use strict';

var express = require('express');
var controller = require('./service.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');



router.get('/privateServices/:id', controller.showPrivateServices);
router.get('/pubclicServices/:id', controller.showPublicServices);
router.post('/privateServices', auth.hasRole('admin'), controller.createPrivateService);

router.delete('/privateServices/:id', auth.hasRole('admin'), controller.deletePrivateService);



router.put('/privateServices/:id', auth.hasRole('admin'),controller.updatePrivateService);


/*
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);*/

module.exports = router;