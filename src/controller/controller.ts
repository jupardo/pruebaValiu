import { Socket } from "socket.io";
import Tag, { TagType } from '../model/tag';
import { jsonify, parse } from '../view/jsonify';
import * as Mongoose from 'mongoose';

Mongoose.connect('mongodb://localhost:27017/tags', { useNewUrlParser: true, useUnifiedTopology: true });

export function handleConnect(socket: Socket): void {
  Tag.find({}, (err, tags) => {
    if (err) {
      throw err;
    }

    const transform: TagType[] = [];
    tags.forEach(tag => {
      const obj = tag.toObject();
      transform.push({
        _id: tag.id,
        randomColor: obj.randomColor,
        name: obj.name
      });
    });

    socket.emit('list', jsonify('list', transform));
  });
}

function createTag(tag: TagType, socket: Socket): void {
  const mongooseTag = new Tag({
    randomColor: tag.randomColor,
    name: tag.name
  });
  mongooseTag.save().then((document) => {
    const doc = document.toObject();
    const object: TagType = {
      _id: document._id,
      name: doc.name,
      randomColor: doc.randomColor
    }
    socket.emit('create', jsonify('create', [object]));
    socket.broadcast.emit('create', jsonify('create', [object]));
  }).catch(() => {
    socket.emit('error', jsonify('error', []));
  });
}

function deleteTag(tag: TagType, socket: Socket): void {
  const remove = new Tag({ _id: tag._id });
  remove.remove().then((removed) => {
    const doc = removed.toObject();
    const object: TagType = {
      _id: removed._id,
      name: doc.name,
      randomColor: doc.randomColor
    }
    socket.emit('delete', jsonify('delete', [object]));
    socket.broadcast.emit('delete', jsonify('delete', [object]));
  }).catch((error) => {
    socket.emit('error', jsonify('error', []));
    socket.broadcast.emit('error', jsonify('error', []));
  });
}

function updateTag(tag: TagType, socket: Socket): void {
  const toUpdate = new Tag({ _id: tag._id, randomColor: tag.randomColor });
  toUpdate.update({ name: tag.name }, (error) => {
    if (error) {
      socket.emit('error', jsonify('error', []));
      socket.broadcast.emit('error', jsonify('error', []));
    } else {
      socket.emit('update', jsonify('update', [tag]));
      socket.broadcast.emit('update', jsonify('update', [tag]));
    }
  });

}

export function handleReceiveMessage(message: string, socket: Socket): void {
  console.log(message);
  const query = parse(message);
  const actions: { [type: string]: (tag: TagType, socket: Socket) => void } = {
    'create': createTag,
    'delete': deleteTag,
    'update': updateTag
  }
  actions[query.action](query.data[0], socket);
}

