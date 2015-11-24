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


var mysql = require('mysql');

var moment =require('moment');
var config = require('../../config/environment');

function mysqlLog(sql,inserts){
    var sqlString = mysql.format(sql, inserts);
    console.log(sqlString);
}
function handleError(res, err) {
    return res.status(500).send(err);
}




// Creates a new community in the DB.
exports.create = function(req, res) {

    console.log(req.user);
    if(req.body.communitycode){
        delete req.body.communitycode;
    }


    var postData = {
        communityname:req.body.communityname,
        citycode:req.body.citycode,
        areacode:req.body.areacode,
        createoperator: req.user._id,
        modifyoperator: req.user._id,
        createtime:moment().format('YYYY-MM-DD HH:mm:ss'),
        modifytime:moment().format('YYYY-MM-DD HH:mm:ss'),
        gpslat:req.body.gpslat,
        gpslng:req.body.gpslng,
        staff_id:req.body.staff_id
    };


      req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('insert into dic_community set ?',postData, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(201).json(results);
        });
    });
};


// Get list of communitys
exports.index = function(req, res) {
    var data = req.query;
    req.getConnection(function(err, connection) {
        if (err) {
            return handleError(res, err);
        }

        if (data.districtId && _.isNumber(parseInt(data.districtId))) {
            connection.query('select * from dic_community where ? and communityname like ?', [{
                'areacode': parseInt(data.districtId)
            }, '%' + data.name + '%'], function(err, results) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(results);
            });
        } else if (data.cityId && _.isNumber(parseInt(data.cityId))) {
            connection.query('select * from dic_community where ? and communityname like ?', [{
                'citycode': parseInt(data.cityId)
            }, '%' + data.name + '%'], function(err, results) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(results);
            });
        } else if (data.provinceId && _.isNumber(parseInt(data.provinceId))) {
            connection.query('select * from dic_community inner join dic_areacode on dic_community.citycode=dic_areacode.areacode where ? and communityname like ?', [{
                'dic_areacode.hihercode': parseInt(data.provinceId)
            }, '%' + data.name + '%'], function(err, results) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(results);
            });
        } else if (data.countryId && _.isNumber(parseInt(data.countryId))) {
            connection.query('select * from dic_community inner join dic_areacode as d1 on dic_community.citycode=d1.areacode inner join dic_areacode as d2 on d1.hihercode=d2.areacode where ? and communityname like ?', [{
                'd2.hihercode': parseInt(data.countryId)
            }, '%' + data.name + '%'], function(err, results) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(results);
            });
        }else if(data.name){
             connection.query('select * from dic_community where communityname like ?', ['%' + data.name + '%'], function(err, results) {
                if (err) {
                    return handleError(res, err);
                }
                return res.status(200).json(results);
            });

        } else {
            return res.status(500).send('no results');
        }

    });


};





// Get a single community
exports.show = function(req, res) {

   req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }

        connection.query('select t1.communityname, t3.* from dic_community as t1 inner join '+config.dbOptions.prefix+'_'+'management_staff as t2 on t1.staff_id=t2.id inner join '+config.dbOptions.prefix+'_'+'management_company as t3 on t2.company_id=t3.id where ?',{'t1.communitycode':req.params.id}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results);
        });
    });

};





//return property management info
exports.showMcompanyInfo = function(req,res){
      req.getConnection(function(err, connection) {
        if(err) { return handleError(res, err); }
        connection.query('select t1.communitycode as communityId,t1.communityname,t2.name as contact_name,t2.mobile as contact_mobile,t3.name from dic_community as t1 inner join '+config.dbOptions.prefix+'_'+'management_staff as t2 on t1.staff_id=t2.id inner join '+config.dbOptions.prefix+'_'+'management_company as t3 on t3.id=t2.company_id where ?',{'t1.communitycode':req.params.id}, function(err, results) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(results[0]);
        });
    });

};


// // Updates an existing community in the DB.
// exports.update = function(req, res) {
//     if(req.body._id) { delete req.body._id; }
//     Community.findById(req.params.id, function (err, community) {
//         if (err) { return handleError(res, err); }
//         if(!community) { return res.status(404).send('Not Found'); }
//         var updated = _.merge(community, req.body);
//         updated.save(function (err) {
//             if (err) { return handleError(res, err); }
//             return res.status(200).json(community);
//         });
//     });
// };

// // Deletes a community from the DB.
// exports.destroy = function(req, res) {
//     Community.findById(req.params.id, function (err, community) {
//         if(err) { return handleError(res, err); }
//         if(!community) { return res.status(404).send('Not Found'); }
//         community.remove(function(err) {
//             if(err) { return handleError(res, err); }
//             return res.status(204).send('No Content');
//         });
//     });
// };
