/**
 * Created by gx761 on 10/16/2015.
 */
'use strict';

var express = require('express');
var controller = require('./community.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();
var auth = require('../../auth/auth.service');


router.get('/', controller.index);
router.get('/countries', controller.getCountries);
router.get('/:countryId/getProvinces', controller.getProvinces);
router.get('/:provinceId/getCities', controller.getCities);
router.get('/:cityId/getDistricts', controller.getDistricts);
router.get('/getCommunities', controller.getCommunities);

router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'),controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;