'use strict';

var express = require('express');
var controller = require('./ajax.controller');

var router = express.Router();

router.get('/countries', controller.getCountries);
router.get('/:countryId/getProvinces', controller.getProvinces);
router.get('/:provinceId/getCities', controller.getCities);
router.get('/:cityId/getDistricts', controller.getDistricts);

module.exports = router;