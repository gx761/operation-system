'use strict';

var express = require('express');
var controller = require('./service.controller');
var router = express.Router();
var auth = require('../../auth/auth.service');



router.get('/publicServices/:communityId', controller.showPublicServices);
router.put('/publicServices/:id', auth.hasRole('admin'),controller.updatePublicService);




router.get('/privateServices/:communityId', controller.showPrivateServices);
router.post('/privateServices', auth.hasRole('admin'), controller.createPrivateService);
router.put('/privateServices/:id', auth.hasRole('admin'),controller.updatePrivateService);
router.delete('/privateServices/:id', auth.hasRole('admin'), controller.deletePrivateService);
router.put('/togglePrivateService/:id', auth.hasRole('admin'),controller.togglePrivateService);





router.post('/o2oServices', auth.hasRole('admin'), controller.createO2oService);
router.get('/o2oServices', controller.showO2oServices);
router.get('/o2oServices/:id/communities', controller.showO2oServiceCommunties);

router.put('/o2oServices/:id', auth.hasRole('admin'),controller.updateO2oService);

router.put('/toggleO2oService/:id', auth.hasRole('admin'),controller.toggleO2oService);

router.delete('/o2oServices/:id', auth.hasRole('admin'), controller.deleteO2oService);


/*
router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);*/

module.exports = router;