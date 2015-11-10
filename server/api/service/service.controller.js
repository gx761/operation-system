'use strict';

var _ = require('lodash');
var Service = require('./service.model');
var moment = require('moment');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var mysql  =require('mysql');

function mysqlLog(sql,inserts){
    var sqlString = mysql.format(sql, inserts);
    console.log(sqlString);
}

function handleError(res, err) {
  return res.status(500).send(err);
}

exports.showPrivateServices = function(req, res) {

  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.query('select * from private_service where ?', {
      'community_id': req.params.id
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  });

};
exports.showPublicServices = function(req, res) {

  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.query('select t1.* from public_service as t1 inner join community_public_service as t2 on t1.id=t2.public_service_id inner join dic_community as t3 on t2.community_id=t3.communitycode where ?', {
      't3.community_id': req.params.id
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  });

};


//Missing data validation
exports.createPrivateService = function(req, res) {


  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = 'tempUploads';
  form.keepExtensions = false;

  form.parse(req, function(err, fields, files) {

    if (err) {
      return handleError(res, err);
    }

    if (files) { //loop files, we only got one file
      _.each(files, function(file) {
        if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) { //if it is not a file, delete and return.
          fs.unlink(file.path, function() {
            console.log('file is deleted');
          });
          return handleError(res, new Error('file type is not supported'));
        } else {
          var oldPath = file.path,
            newPath = 'uploads' + path.sep + Date.now() + file.name;

          fs.rename(oldPath, newPath, function() {
            console.log('file is saved');

            var postData = fields;
            postData.status = 'inactive';
            postData.createoperator = req.user.id;
            postData.modifyoperator = req.user.id;
            postData.createtime = moment().format('YYYY-MM-DD HH:mm:ss');
            postData.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');
            postData.logo_url = newPath;
            req.getConnection(function(err, connection) {
              if (err) {
                return handleError(res, err);
              }
              connection.query('insert into private_service set ?', postData, function(err, results) {
                if (err) {
                  return handleError(res, err);
                }
                if (results.insertId) {

                  connection.query('select * from private_service where ?', {
                    id: results.insertId
                  }, function(err, results) {
                    if (err) {
                      return handleError(res, err);
                    }

                    return res.status(201).json(results);
                  });

                }

              });
            });


          });

        }

      });

    } else {
      return handleError(res, new Error('there is no file'));
    }

  });

};

exports.updatePrivateService=function(req,res){

console.log(req.body);

  if(!req.body){
    return handleError(res,new Error('no body'));
  }
  var id = req.body.id;

   req.body.createtime=moment(req.body.createtime).format('YYYY-MM-DD HH:mm:ss');
   req.body.modifytime=moment().format('YYYY-MM-DD HH:mm:ss');
   req.body.modifyoperator=req.user._id;
   delete req.body.id;

  req.getConnection(function(err,connection){
    if(err){
      return handleError(res,err);
    }

    
    connection.query('update private_service set ? where ?',[req.body,{'id':id}],function(err,results){
      if(err){
        return handleError(res,err);
      }
       
       console.log(results);
       return res.status(200).json(results);

    });

  });


},



exports.deletePrivateService = function(req, res) {

  var serviceId = parseInt(req.params.id);
  if (!_.isNumber(serviceId)||isNaN(serviceId)) {
    return handleError(res,new Error('Id is invalid'));
  }


  req.getConnection(function(err,connection){
    if(err){
      return handleError(res,err);
    }
    mysqlLog('delete  from private_service where ?',{id:serviceId});
    connection.query('delete  from private_service where ?',{id:serviceId},function(err,results){
      if(err){
        return handleError(res,err);
      }
      return res.status(200).json(results);

    });

  });

},






// Get list of services
exports.index = function(req, res) {
  Service.find(function(err, services) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(services);
  });
};

// Get a single service
exports.show = function(req, res) {
  Service.findById(req.params.id, function(err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.status(404).send('Not Found');
    }
    return res.json(service);
  });
};

// Creates a new service in the DB.
exports.create = function(req, res) {
  Service.create(req.body, function(err, service) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(service);
  });
};

// Updates an existing service in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Service.findById(req.params.id, function(err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(service, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(service);
    });
  });
};

// Deletes a service from the DB.
exports.destroy = function(req, res) {
  Service.findById(req.params.id, function(err, service) {
    if (err) {
      return handleError(res, err);
    }
    if (!service) {
      return res.status(404).send('Not Found');
    }
    service.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};