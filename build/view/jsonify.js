"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function jsonify(action, data) {
    return JSON.stringify({
        action: action,
        data: data
    });
}
exports.jsonify = jsonify;
function parse(message) {
    var _a = JSON.parse(message), action = _a.action, data = _a.data;
    return {
        action: action,
        data: data
    };
}
exports.parse = parse;
