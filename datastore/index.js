const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var filePath = path.join(exports.dataDir, id + '.txt');
    // items.id = id;
    // items.text = text;
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        return err;
      }
      callback(null, { id, text });
      // console.log(items);
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, arrayOfFiles) => {
    var dataArray = _.map(arrayOfFiles, (file) => {
      return {id: file.slice(0, 5), text: file.slice(0, 5)};
    });
    callback(null, dataArray);
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, content) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
      return;
    }
    callback(null, {id, text: content.toString()});
  });
};

exports.update = (id, text, callback) => {
  const fileDir = exports.dataDir + '/';

  fs.readdir(fileDir, (err, files) => {
    var fileIds = _.map(files, (fileName) => {
      return fileName.slice(0, 5);
    });
    if (fileIds.includes(id)) {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        callback(null, { id, text });
      });
    } else {
      callback(new Error(`No item with id: ${id}`));
    }
  });
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
