"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tag_1 = require("../model/tag");
var jsonify_1 = require("../view/jsonify");
var Mongoose = require("mongoose");
Mongoose.connect('mongodb://localhost:27017/tags', { useNewUrlParser: true, useUnifiedTopology: true });
function handleConnect(socket) {
    tag_1.default.find({}, function (err, tags) {
        if (err) {
            throw err;
        }
        var transform = [];
        tags.forEach(function (tag) {
            var obj = tag.toObject();
            transform.push({
                _id: tag.id,
                randomColor: obj.randomColor,
                name: obj.name
            });
        });
        socket.emit('list', jsonify_1.jsonify('list', transform));
    });
}
exports.handleConnect = handleConnect;
function createTag(tag, socket) {
    var mongooseTag = new tag_1.default({
        randomColor: tag.randomColor,
        name: tag.name
    });
    mongooseTag.save().then(function (document) {
        var doc = document.toObject();
        var object = {
            _id: document._id,
            name: doc.name,
            randomColor: doc.randomColor
        };
        socket.emit('create', jsonify_1.jsonify('create', [object]));
        socket.broadcast.emit('create', jsonify_1.jsonify('create', [object]));
    }).catch(function () {
        socket.emit('error', jsonify_1.jsonify('error', []));
    });
}
function deleteTag(tag, socket) {
    var remove = new tag_1.default({ _id: tag._id });
    remove.remove().then(function (removed) {
        var doc = removed.toObject();
        var object = {
            _id: removed._id,
            name: doc.name,
            randomColor: doc.randomColor
        };
        socket.emit('delete', jsonify_1.jsonify('delete', [object]));
        socket.broadcast.emit('delete', jsonify_1.jsonify('delete', [object]));
    }).catch(function (error) {
        socket.emit('error', jsonify_1.jsonify('error', []));
        socket.broadcast.emit('error', jsonify_1.jsonify('error', []));
    });
}
function updateTag(tag, socket) {
    var toUpdate = new tag_1.default({ _id: tag._id, randomColor: tag.randomColor });
    toUpdate.update({ name: tag.name }, function (error) {
        if (error) {
            socket.emit('error', jsonify_1.jsonify('error', []));
            socket.broadcast.emit('error', jsonify_1.jsonify('error', []));
        }
        else {
            socket.emit('update', jsonify_1.jsonify('update', [tag]));
            socket.broadcast.emit('update', jsonify_1.jsonify('update', [tag]));
        }
    });
}
function handleReceiveMessage(message, socket) {
    console.log(message);
    var query = jsonify_1.parse(message);
    var actions = {
        'create': createTag,
        'delete': deleteTag,
        'update': updateTag
    };
    actions[query.action](query.data[0], socket);
}
exports.handleReceiveMessage = handleReceiveMessage;
