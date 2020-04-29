"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mongoose = require("mongoose");
var tagSchema = new Mongoose.Schema({
    randomColor: String,
    name: String
});
exports.default = Mongoose.model('Tag', tagSchema);
