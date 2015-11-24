'use strict';

var express = require('express');
var controller = require('./ajax.controller');

var router = express.Router();

router.get('/countries', controller.getCountries);
router.get('/:countryId/getProvinces', controller.getProvinces);
router.get('/:provinceId/getCities', controller.getCities);
router.get('/:cityId/getDistricts', controller.getDistricts);
router.get('/companies', controller.getManagementCompanies);

router.get('/:company_id/getManagementStaff', controller.getManagementStaff);


module.exports = router;
