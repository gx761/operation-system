'use strict';

var _ = require('lodash');
var Service = require('./service.model');
var moment = require('moment');
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var mysql = require('mysql');
var Q = require('q');
var path = require('path');
var async = require('async');
var config = require('../../config/environment');

function mysqlLog(sql, inserts) {
  var sqlString = mysql.format(sql, inserts);
  console.log(sqlString);
}

function handleError(res, err) {
  return res.status(500).send(err);
}



function findMaxOrder(req, res, community_id) {
  var deferred = Q.defer();
  req.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    }

    connection.query('select MAX(t1.order) as `order`  from (select `order` from '+config.dbOptions.prefix+'_'+'private_service where ? union select `order` from '+config.dbOptions.prefix+'_'+'community_public_service where ? ) as t1', [{
      community_id: community_id,
    }, {
      community_id: community_id
    }], function(err, results) {
      if (err) {
        deferred.reject(err);
      }
      if(results[0].order===null){
        deferred.resolve(0);
      }else{
        deferred.resolve(results[0].order);
      }
      

    });

  });
  return deferred.promise;

}


function checkO2oServiceDeletable(req, res, id) {
  var deferred = Q.defer();
  req.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    }

    connection.query('select count(*) as numberOfCommunities from '+config.dbOptions.prefix+'_'+'community_public_service where ?', {
      public_service_id: id
    }, function(err, results) {
      if (err) {
        deferred.reject(err);
      }
      if (results[0].numberOfCommunities > 0) {
        deferred.reject(results[0].numberOfCommunities);
      } else {
        deferred.resolve();
      }
    });

  });
  return deferred.promise;
}


function updatePrivateServices(req, res, privateServices, callback) {
  req.getConnection(function(err, connection) {
    if (err) {
      callback(err);
    }
    connection.beginTransaction(function(err) {
      if (err) {
        callback(err);
      }

      (function updatePrivateServiceIn() {

        var privateService = privateServices.pop();
        connection.query(' update '+config.dbOptions.prefix+'_'+'private_service set ? where ?', [{
          'order': privateService.order
        }, {
          'id': privateService.id
        }], function(err, results) {
          if (err) {
            return connection.rollback(function() {
              callback(err);
            });
          }
          if (privateServices.length > 0) {
            updatePrivateServiceIn();
          } else {

            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  callback(err);
                });
              }

              callback(null, 'success');
              //  return res.status(200).send('update success');
            });
          }

        });
      })();
    });
  });
}

function updatePublicServices(req, res, publicServices, callback) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.beginTransaction(function(err) {
      if (err) {
        callback(err);
      }
      (function updatePublicServiceIn() {

        var publicService = publicServices.pop();
        connection.query(' update '+config.dbOptions.prefix+'_'+'community_public_service set ? where ? and ?', [{
          'order': publicService.order
        }, {
          'public_service_id': publicService.id,
        }, {
          'community_id': publicService.community_id
        }], function(err, results) {
          if (err) {
            return connection.rollback(function() {
              callback(err);
            });
          }
          if (publicServices.length > 0) {
            updatePublicServiceIn();
          } else {

            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  callback(err);
                });
              }
              callback(null, 'success');
              //  return res.status(200).send('update success');
            });
          }

        });
      })();
    });
  });
}



exports.showAllServices = function(req,res){

  var community_id = req.params.id;

  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.query('select * from (select t1.id,t1.service_type_id,t1.name,t1.url,t1.note,t1.charger_name,t1.charger_mobile, t1.requester_name,t1.requester_mobile,t1.logo_url, case when t3.community_id is null then "inactive" else "active" end as status, t3.order from '+config.dbOptions.prefix+'_'+'public_service as t1 left join (select t1.id,t2.community_id,t2.order from '+config.dbOptions.prefix+'_'+'public_service as t1 inner join '+config.dbOptions.prefix+'_'+'community_public_service as t2 on t1.id=t2.public_service_id where ? ) as t3 on t1.id = t3.id where t1.status="active" and t3.community_id is not null   union select t1.id,t1.service_type_id,t1.name,t1.url,t1.note,t1.charger_name,t1.charger_mobile,t1.requester_name,t1.requester_mobile,t1.logo_url,t1.status,t1.order from '+config.dbOptions.prefix+'_'+'private_service as t1 where ? and status="active" ) as t4  order by `order`', [{'t2.community_id':community_id},{'community_id':community_id}], function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  });




};


exports.orderService = function(req, res) {
  var data = req.body;
  var privateServices = data.privateServiceData;
  var publicServices = data.publicServiceData;

  async.series([
    function(callback) {
      updatePublicServices(req, res, publicServices, callback);
    },
    function(callback) {
      updatePrivateServices(req, res, privateServices, callback);
    },

  ], function(err, result) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).send('update success');


  });

};


exports.showO2oServiceCommunties = function(req, res) {
  var public_service_id = req.params.id;

  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.query('  select t1.community_id,t2.communityname,t6.name as provincename,t4.name as cityname,t3.name as districtname from '+config.dbOptions.prefix+'_'+'community_public_service as t1 left join '+config.dbOptions.prefix+'_'+'dic_community as t2 inner join dic_areacode as t3 on t2.areacode=t3.areacode inner join dic_areacode as t4 on t2.citycode=t4.areacode inner join dic_areacode as t5 on t2.citycode=t5.areacode inner join dic_areacode as t6 on t6.areacode=t5.hihercode on t1.community_id=t2.communitycode where ?', {
      't1.public_service_id': public_service_id
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
    connection.query('select t1.id,t1.service_type_id,t1.name,t1.url,t1.note,t1.charger_name,t1.charger_mobile, t1.requester_name,t1.requester_mobile,t1.logo_url, case when t3.community_id is null then "inactive" else "active" end as status,t3.community_id,t3.order from '+config.dbOptions.prefix+'_'+'public_service as t1 left join (select t1.id,t2.community_id,t2.order from '+config.dbOptions.prefix+'_'+'public_service as t1 inner join '+config.dbOptions.prefix+'_'+'community_public_service as t2 on t1.id=t2.public_service_id where ? ) as t3 on t1.id = t3.id where t1.status="active"', {
      't2.community_id': req.params.communityId
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  });

};


function returnPublicService(req, res, public_service_id, community_id) {

  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }


    connection.query('select t1.id,t1.service_type_id,t1.name,t1.url,t1.note,t1.charger_name,t1.charger_mobile, t1.requester_name,t1.requester_mobile,t1.logo_url, case when t3.community_id is null then "inactive" else "active" end as status, t3.community_id,t3.order from '+config.dbOptions.prefix+'_'+'public_service as t1 inner join (select t1.id,t2.community_id,t2.order from '+config.dbOptions.prefix+'_'+'public_service as t1 inner join '+config.dbOptions.prefix+'_'+'community_public_service as t2 on t1.id=t2.public_service_id where ? and ? ) as t3 on t1.id = t3.id where t1.status="active"', [{
      't2.community_id': community_id,
    }, {
      't2.public_service_id': public_service_id,
    }], function(err, results) {
      if (err) {
        return handleError(res, err);
      }

      return res.status(200).json(results[0]);
    });
  });

}


/**
 * Update public services of a community, please note the difference between O2O service and public serivce.
 * @return Json     return the db manipulation result.
 */
exports.updatePublicService = function(req, res) {

  if (req.body.status === 'inactive') { //if trying to disable the public for a community, delete it from the community_public_service table

    req.getConnection(function(err, connection) {
      if (err) {
        return handleError(res, err);
      }

      connection.query('delete from '+config.dbOptions.prefix+'_'+'community_public_service where ? and ?', [{
        'public_service_id': req.body.id,
      }, {
        'community_id': req.body.community_id
      }], function(err, results) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(results);
      });
    });

  } else if (req.body.status === 'active') {
    req.getConnection(function(err, connection) {
      if (err) {
        return handleError(res, err);
      }

      connection.query('select status from '+config.dbOptions.prefix+'_'+'public_service where ?', { //if trying to enable it, check if it is globally enabled.
        id: req.body.id
      }, function(err, results) {
        if (err) {
          return handleError(res, err);
        }

        if (results[0].status === 'inactive') {
          return handleError(res, new Error('this service is not avaliable'));
        }

        findMaxOrder(req, res, req.body.community_id).then(function(value) {

          connection.query('insert into '+config.dbOptions.prefix+'_'+'community_public_service  set ?', {
            'public_service_id': req.body.id,
            'community_id': req.body.community_id,
            'order': parseInt(value) + 1
          }, function(err, results) {
            if (err) {
              return handleError(res, err);
            }

            if (results.affectedRows) {
              returnPublicService(req, res, req.body.id, req.body.community_id);
            }
          });

        });
      });



    });

  } else {
    return handleError(res, new Error('invalid request'));
  }

};



exports.showPrivateServices = function(req, res) {

  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.query('select t1.id,t1.community_id,t1.service_type_id,t1.name,t1.url,t1.note,t1.charger_name,t1.charger_mobile,t1.requester_name,t1.requester_mobile,t1.logo_url,t1.status,t1.order from '+config.dbOptions.prefix+'_'+'private_service as t1 where ?', {
      'community_id': req.params.communityId
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(results);
    });
  });

};


/**
 * List all O2O sevices
 * @return json     return the list of all serivices.
 */
exports.showO2oServices = function(req, res) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }

    connection.query('select * from '+config.dbOptions.prefix+'_'+'public_service ',
      function(err, results) {
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
  form.uploadDir = 'app/tempUploads';
  form.keepExtensions = false;

  form.parse(req, function(err, fields, files) {

    if (err) {
      return handleError(res, err);
    }

    if (files) { //loop files, we only got one file, the files always exist.
      _.each(files, function(file) {
        if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) { //if it is not a file, delete and return.
          fs.unlink(file.path, function() {
            console.log('file is deleted');
          });
          return handleError(res, new Error('file type is not supported'));
        } else {
          var oldPath = file.path,
            newWebPath = 'uploads' + path.sep + 'private' + path.sep + Date.now() + file.name, //the relative file path on disk
            newPath = 'app' + path.sep + newWebPath; // the relative file path on web

          fs.rename(oldPath, newPath, function() {
            console.log('file is saved');

            var postData = fields;
            postData.status = 'inactive';
            postData.createoperator = req.user.id;
            postData.modifyoperator = req.user.id;
            postData.createtime = moment().format('YYYY-MM-DD HH:mm:ss');
            postData.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');
            postData.logo_url = newWebPath;


            findMaxOrder(req, res, postData.community_id).then(function(value) { // Find the corrent order to insert
              console.log(value);
              postData.order = parseInt(value) + 1;

              req.getConnection(function(err, connection) {
                if (err) {
                  return handleError(res, err);
                }
                console.log(postData);
                connection.query('insert into '+config.dbOptions.prefix+'_'+'private_service set ?', postData, function(err, results) {
                  if (err) {
                    return handleError(res, err);
                  }
                  if (results.insertId) {

                    connection.query('select * from '+config.dbOptions.prefix+'_'+'private_service where ?', {
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
          });
        }
      });
    } else {
      return handleError(res, new Error('there is no file'));
    }

  });

};



//Missing data validation
exports.createO2oService = function(req, res) {

  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = 'app/tempUploads';
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
            newWebPath = 'uploads' + path.sep + 'public' + path.sep + Date.now() + file.name,
            newPath = 'app' + path.sep + newWebPath;

          fs.rename(oldPath, newPath, function() {
            console.log('file is saved');

            var postData = fields;
            postData.status = 'inactive';
            postData.createoperator = req.user.id;
            postData.modifyoperator = req.user.id;
            postData.createtime = moment().format('YYYY-MM-DD HH:mm:ss');
            postData.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');
            postData.logo_url = newWebPath;
            req.getConnection(function(err, connection) {
              if (err) {
                return handleError(res, err);
              }

              connection.query('insert into '+config.dbOptions.prefix+'_'+'public_service set ?', postData, function(err, results) {
                if (err) {
                  return handleError(res, err);
                }
                if (results.insertId) {

                  connection.query('select * from '+config.dbOptions.prefix+'_'+'public_service where ?', {
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


function updatePrivateServiceDataAndReturn(req, res, data, id) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }

    connection.query('update private_service set ?', data, function(err, results) {
      if (err) {
        return handleError(res, err);
      }

      connection.query('select * from '+config.dbOptions.prefix+'_'+'private_service where ?', {
        id: id
      }, function(err, results) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(results);
      });

    });
  });

}

function deletePrivateServiceImage(req, res, id) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }

    connection.query('select logo_url from '+config.dbOptions.prefix+'_'+'private_service where ?', {
      id: id
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }

      var logoPath = 'app/' + results[0].logo_url;

      fs.stat(logoPath, function(err, stats) {
        if (err) {
          console.log('file does not exist');
        } else {
          fs.unlink(logoPath, function(err) {
            if (err) {
              return handleError(res, err);
            }
          });
        }
      });
    });
  });

}



exports.updatePrivateService = function(req, res) {

  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = 'app/tempUploads';
  form.keepExtensions = false;

  form.parse(req, function(err, fields, files) {
    console.log(fields);

    if (err) {
      return handleError(res, err);
    }

    var id = req.params.id;
    var postData = fields;
    postData.modifyoperator = req.user.id;
    postData.createtime = moment().format('YYYY-MM-DD HH:mm:ss');
    postData.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (files) { //loop files, we only got one file

      _.each(files, function(file) {

        if (file.size <= 0) {
          updatePrivateServiceDataAndReturn(req, res, postData, id);
        } else {

          if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) { //if it is not a file, delete and return.
            fs.unlink(file.path, function() {
              console.log('file is deleted');
            });
            return handleError(res, new Error('file type is not supported'));
          } else {
            var oldPath = file.path,
              newWebPath = 'uploads' + path.sep + 'private' + path.sep + Date.now() + file.name,
              newPath = 'app' + path.sep + newWebPath;

            deletePrivateServiceImage(req, res, id);
            fs.rename(oldPath, newPath, function() {
              console.log('file is saved');
              postData.logo_url = newWebPath;
              updatePrivateServiceDataAndReturn(req, res, postData, id);
            });
          }
        }
      });
    }
  });


};



exports.togglePrivateService = function(req, res) {

  if (!req.body) {
    return handleError(res, new Error('no body'));
  }
  var id = req.body.id;

  req.body.createtime = moment(req.body.createtime).format('YYYY-MM-DD HH:mm:ss');
  req.body.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');
  req.body.modifyoperator = req.user._id;
  delete req.body.id;



  findMaxOrder(req, res, req.body.community_id).then(function(value) {

    if (req.body.status === 'active') { // For activation, increment the order, for inactivation, decrement the order number.
      req.body.order = parseInt(value) + 1;
    }

    req.getConnection(function(err, connection) {
      if (err) {
        return handleError(res, err);
      }
      connection.query('update '+config.dbOptions.prefix+'_'+'private_service set ? where ?', [req.body, {
        'id': id
      }], function(err, results) {
        if (err) {
          return handleError(res, err);
        }

        connection.query('select t1.id,t1.community_id,t1.service_type_id,t1.name,t1.url,t1.note,t1.charger_name,t1.charger_mobile,t1.requester_name,t1.requester_mobile,t1.logo_url,t1.status,t1.order from '+config.dbOptions.prefix+'_'+'private_service as t1 where ?', {
            't1.id': id
          },
          function(err, results) {
            return res.status(200).json(results[0]);
          });

      });
    });



  });



};



exports.deletePrivateService = function(req, res) {

  var serviceId = parseInt(req.params.id);
  if (!_.isNumber(serviceId) || isNaN(serviceId)) {
    return handleError(res, new Error('Id is invalid'));
  }


  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }

    connection.query('select logo_url from '+config.dbOptions.prefix+'_'+'private_service where ?', {
      id: serviceId
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      var logoPath = results[0].logo_url;

      fs.stat(logoPath, function(err, stats) {
        if (err) {
          console.log('file does not exist');
        } else {

          fs.unlink(logoPath, function(err) {
            if (err) {
              return handleError(res, err);
            }
          });
        }
      });

      connection.query('delete  from '+config.dbOptions.prefix+'_'+'private_service where ?', {
        id: serviceId
      }, function(err, results) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(200).json(results);
      });

    });

  });

};


function checkO2oServiceSuspendable(req, res, id) {
  var deferred = Q.defer();
  req.getConnection(function(err, connection) {
    if (err) {
      deferred.reject(err);
    }
    connection.query('select count(*) as numberOfCommunities from '+config.dbOptions.prefix+'_'+'community_public_service where ? ', {
      public_service_id: id
    }, function(err, results) {
      if (err) {
        deferred.reject(err);
      }
      if (results[0].numberOfCommunities > 0) {
        deferred.reject(results[0].numberOfCommunities);
      } else {
        deferred.resolve();
      }
    });

  });
  return deferred.promise;
}



function updateO2oServiceData(req, res, data, id) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }
    connection.query('update '+config.dbOptions.prefix+'_'+'public_service set ? where ?', [data, {
      'id': id
    }], function(err, results) {
      if (err) {
        return handleError(res, err);
      }
      console.log(results);
      return res.status(200).json(results);
    });
  });
}


function updateO2oServiceDataAndReturn(req, res, data, id) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }

    connection.query('update '+config.dbOptions.prefix+'_'+'public_service set ?', data, function(err, results) {
      if (err) {
        return handleError(res, err);
      }


      connection.query('select * from '+config.dbOptions.prefix+'_'+'public_service where ?', {
        id: id
      }, function(err, results) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(results);
      });

    });
  });

}

function deleteO2oServiceImage(req, res, id) {
  req.getConnection(function(err, connection) {
    if (err) {
      return handleError(res, err);
    }

    connection.query('select logo_url from '+config.dbOptions.prefix+'_'+'public_service where ?', {
      id: id
    }, function(err, results) {
      if (err) {
        return handleError(res, err);
      }

      var logoPath = 'app/' + results[0].logo_url;

      fs.stat(logoPath, function(err, stats) {
        if (err) {
          console.log('file does not exist');
        } else {
          fs.unlink(logoPath, function(err) {
            if (err) {
              return handleError(res, err);
            }
          });
        }
      });
    });
  });

}



exports.updateO2oService = function(req, res) {

  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = 'app/tempUploads';
  form.keepExtensions = false;

  form.parse(req, function(err, fields, files) {

    if (err) {
      return handleError(res, err);
    }

    var id = req.params.id;
    var postData = fields;
    postData.modifyoperator = req.user.id;
    postData.createtime = moment().format('YYYY-MM-DD HH:mm:ss');
    postData.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');

    if (files) { //loop files, we only got one file

      _.each(files, function(file) {

        if (file.size <= 0) {
          updateO2oServiceDataAndReturn(req, res, postData, id);
        } else {

          if (['image/jpeg', 'image/png'].indexOf(file.type) === -1) { //if it is not a file, delete and return.
            fs.unlink(file.path, function() {
              console.log('file is deleted');
            });
            return handleError(res, new Error('file type is not supported'));
          } else {
            var oldPath = file.path,
              newWebPath = 'uploads' + path.sep + 'public' + path.sep + Date.now() + file.name,
              newPath = 'app' + path.sep + newWebPath;

            deleteO2oServiceImage(req, res, id);
            fs.rename(oldPath, newPath, function() {
              console.log('file is saved');
              postData.logo_url = newWebPath;
              updateO2oServiceDataAndReturn(req, res, postData, id);
            });
          }
        }

      });

    }

  });

};

exports.toggleO2oService = function(req, res) {

  if (!req.body) {
    return handleError(res, new Error('no body'));
  }
  var id = req.body.id;

  req.body.createtime = moment(req.body.createtime).format('YYYY-MM-DD HH:mm:ss');
  req.body.modifytime = moment().format('YYYY-MM-DD HH:mm:ss');
  req.body.modifyoperator = req.user._id;
  delete req.body.id;

  if (req.body.status === 'active') { //If activating the service, just activate it.

    updateO2oServiceData(req, res, req.body, id);


  } else { // if trying to disbale the service, check if any service is used.

    checkO2oServiceSuspendable(req, res, id).then(function(value) {

      updateO2oServiceData(req, res, req.body, id);

    }, function(numberOfCommunities) {
      res.status(500).json({
        numberOfCommunities: numberOfCommunities
      }); //return the how manay communitires are using the service

    });


  }

};



exports.deleteO2oService = function(req, res) {

  var serviceId = parseInt(req.params.id);
  if (!_.isNumber(serviceId) || isNaN(serviceId)) {
    return handleError(res, new Error('Id is invalid'));
  }

  checkO2oServiceDeletable(req, res, serviceId).then(function(value) {

    req.getConnection(function(err, connection) {
      if (err) {
        return handleError(res, err);
      }

      connection.query('select logo_url from '+config.dbOptions.prefix+'_'+'public_service where ?', {
        id: serviceId
      }, function(err, results) {
        if (err) {
          return handleError(res, err);
        }
        var logoPath = results[0].logo_url;

        fs.stat(logoPath, function(err, stats) {
          if (err) {
            console.log('file does not exist');
          } else {
            fs.unlink(logoPath, function(err) {
              if (err) {
                return handleError(res, err);
              }
            });
          }
        });

        connection.query('delete  from '+config.dbOptions.prefix+'_'+'public_service where ?', {
          id: serviceId
        }, function(err, results) {
          if (err) {
            return handleError(res, err);
          }
          return res.status(200).json(results);
        });
      });

    });

  }, function(numberOfCommunities) {
    res.status(500).json({
      numberOfCommunities: numberOfCommunities
    }); //return the how manay communitires are using the service

  });



};

