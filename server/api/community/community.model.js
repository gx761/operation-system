/**
 * Created by gx761 on 10/16/2015.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommunitySchema = new Schema({
    name: String,
    info: String,
    active: Boolean
});

module.exports = mongoose.model('Community', CommunitySchema);