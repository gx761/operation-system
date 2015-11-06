'use strict';

var express = require('express');
var controller = require('./service.controller');

var router = express.Router();


router.get('/privateServices/:id', controller.showPrivateServices);
router.get('/pubclicServices/:id', controller.showPublicServices);
router.post('/privateServices', controller.createPrivateService);


router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;