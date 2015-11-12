'use strict';

var express = require('express');
var controller = require('./service.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');



router.get('/pubclicServices/:id', controller.showPublicServices);




router.get('/privateServices/:id', controller.showPrivateServices);
router.post('/privateServices', auth.hasRole('admin'), controller.createPrivateService);
router.put('/privateServices/:id', auth.hasRole('admin'),controller.updatePrivateService);
router.delete('/privateServices/:id', auth.hasRole('admin'), controller.deletePrivateService);





router.post('/o2oServices', auth.hasRole('admin'), controller.createO2oService);

router.get('/o2oServices', controller.showO2oServices);
router.put('/o2oServices/:id', auth.hasRole('admin'),controller.updateO2oService);
router.delete('/o2oServices/:id', auth.hasRole('admin'), controller.deleteO2oService);


/*
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);*/

module.exports = router;