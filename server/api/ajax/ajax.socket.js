/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Ajax = require('./ajax.model');

exports.register = function(socket) {
  Ajax.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Ajax.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('ajax:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('ajax:remove', doc);
}