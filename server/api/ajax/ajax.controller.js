'use strict';

var _ = require('lodash');
var mysql = require('mysql');
var moment =require('moment');
var config = require('../../config/environment');
var User = require('./managementUser.model');


function mysqlLog(sql,inserts){
    var sqlString = mysql.format(sql, inserts);
    console.log(sqlString);
}

function handleError(res, err) {
    return res.status(500).send(err);
}
exports.getCountries = function(req,res){

    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }

        connection.query('select areacode,name,level from dic_areacode where level=0 and areacode=86', function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getProvinces = function(req,res){
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select areacode,name,level from dic_areacode where level=1 and ?',{'hihercode':req.params.countryId}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getCities = function(req,res){
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select areacode,name,level from dic_areacode where level=2 and ?',{'hihercode':req.params.provinceId}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getDistricts = function(req,res){
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select areacode,name,level from dic_areacode where level=3 and ?',{'hihercode':req.params.cityId}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getManagementCompanies = function(req,res){
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select id,name from yy_management_company', function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getManagementStaff = function(req,res){

    User.find({companyId:req.params.company_id},'_id name',function(err,users){
        if(err) { return handleError(res, err); }
        console.log(users);
        return res.status(200).json(users);
    });

    //req.getConnection(function(err, connection) {
    //    if(err) { return handleError(res, err); }
    //    connection.query('select id,name from yy_management_staff where ? and role="admin"',{'company_id':req.params.company_id}, function(err, results) {
    //        if(err) { return handleError(res, err); }
    //        return res.status(200).json(results);
    //    });
    //});
};