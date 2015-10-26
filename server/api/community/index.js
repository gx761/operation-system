/**
 * Created by gx761 on 10/16/2015.
 */
'use strict';

var express = require('express');
var controller = require('./community.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/countries', controller.getCountries);
router.get('/:countryId/getProvinces', controller.getProvinces);
router.get('/:provinceId/getCities', controller.getCities);
router.get('/:cityId/getDistricts', controller.getDistricts);
router.get('/getCommunities', controller.getCommunities);

router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;