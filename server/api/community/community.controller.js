/**
 * Created by gx761 on 10/16/2015.
 */
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /communitys              ->  index
 * POST    /communitys              ->  create
 * GET     /communitys/:id          ->  show
 * PUT     /communitys/:id          ->  update
 * DELETE  /communitys/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Community = require('./community.model');
var mysql = require('mysql');


function mysqlLog(sql,inserts){
    var sqlString = mysql.format(sql, inserts);
    console.log(sqlString);
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
        connection.query('select areacode,name,level from dic_areacode where level=1 and ?',{"hihercode":req.params.countryId}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getCities = function(req,res){
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select areacode,name,level from dic_areacode where level=2 and ?',{"hihercode":req.params.provinceId}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};

exports.getDistricts = function(req,res){
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select areacode,name,level from dic_areacode where level=3 and ?',{"hihercode":req.params.cityId}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });
};
exports.getCommunities = function(req,res){
    var data =req.query;
    req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }

        if(data.districtId&&_.isNumber(parseInt(data.districtId))){
            connection.query('select * from dic_community where ? and communityname like ?',[{"areacode":parseInt(data.districtId)},'%'+data.name+'%'], function(err, results) {
                if(err) { return handleError(res, err); }
                return res.status(200).json(results);
            });
        }
        else if(data.cityId&& _.isNumber(parseInt(data.cityId))){
            connection.query('select * from dic_community where ? and communityname like ?',[{"citycode":parseInt(data.cityId)},'%'+data.name+'%'], function(err, results) {
                if(err) { return handleError(res, err); }
                return res.status(200).json(results);
            })
        }
        else if(data.provinceId&& _.isNumber(parseInt(data.provinceId))){
            connection.query('select * from dic_community inner join dic_areacode on dic_community.citycode=dic_areacode.areacode where ? and communityname like ?',[{"dic_areacode.hihercode":parseInt(data.provinceId)},'%'+data.name+'%'], function(err, results) {
                if(err) { return handleError(res, err); }
                return res.status(200).json(results);
            })
        }
        else if(data.countryId&& _.isNumber(parseInt(data.countryId))){
            connection.query('select * from dic_community inner join dic_areacode as d1 on dic_community.citycode=d1.areacode inner join dic_areacode as d2 on d1.hihercode=d2.areacode where ? and communityname like ?',[{"d2.hihercode":parseInt(data.countryId)},'%'+data.name+'%'], function(err, results) {
                if(err) { return handleError(res, err); }
                return res.status(200).json(results);
            })
        }
        else{
            return res.status(500).send();
        }


    });

};




// Get list of communitys
exports.index = function(req, res) {
    Community.find(function (err, communitys) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(communitys);
    });
};

// Get a single community
exports.show = function(req, res) {
    Community.findById(req.params.id, function (err, community) {
        if(err) { return handleError(res, err); }
        if(!community) { return res.status(404).send('Not Found'); }
        return res.json(community);
    });
};

// Creates a new community in the DB.
exports.create = function(req, res) {
    Community.create(req.body, function(err, community) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(community);
    });
};

// Updates an existing community in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Community.findById(req.params.id, function (err, community) {
        if (err) { return handleError(res, err); }
        if(!community) { return res.status(404).send('Not Found'); }
        var updated = _.merge(community, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(community);
        });
    });
};

// Deletes a community from the DB.
exports.destroy = function(req, res) {
    Community.findById(req.params.id, function (err, community) {
        if(err) { return handleError(res, err); }
        if(!community) { return res.status(404).send('Not Found'); }
        community.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}