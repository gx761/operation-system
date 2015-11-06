'use strict';

var _ = require('lodash');
var Service = require('./service.model');
var moment =require('moment');



exports.showPrivateServices = function(req, res) {

   req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select * from private_service where ?',{'community_id':req.params.id}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });

};
exports.showPublicServices = function(req, res) {

   req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select t1.* from public_service as t1 inner join community_public_service as t2 on t1.id=t2.public_service_id inner join dic_community as t3 on t2.community_id=t3.communitycode where ?',{'t3.community_id':req.params.id}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });

};

exports.createPrivateService = function(req,res){

console.log(req.body);


};




// Get list of services
exports.index = function(req, res) {
  Service.find(function (err, services) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(services);
  });
};

// Get a single service
exports.show = function(req, res) {
  Service.findById(req.params.id, function (err, service) {
    if(err) { return handleError(res, err); }
    if(!service) { return res.status(404).send('Not Found'); }
    return res.json(service);
  });
};

// Creates a new service in the DB.
exports.create = function(req, res) {
  Service.create(req.body, function(err, service) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(service);
  });
};

// Updates an existing service in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Service.findById(req.params.id, function (err, service) {
    if (err) { return handleError(res, err); }
    if(!service) { return res.status(404).send('Not Found'); }
    var updated = _.merge(service, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(service);
    });
  });
};

// Deletes a service from the DB.
exports.destroy = function(req, res) {
  Service.findById(req.params.id, function (err, service) {
    if(err) { return handleError(res, err); }
    if(!service) { return res.status(404).send('Not Found'); }
    service.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}