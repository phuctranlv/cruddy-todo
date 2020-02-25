const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  exports.initialize ();
  var id = counter.getNextUniqueId((err, id) => {
    // var item = {};
    // item[id] = text;
    // item['id'] = id;
    // item['text'] = text;
    // text = JSON.stringify({ id: id, text: text });
    // text = JSON.stringify(item);
    // console.log(text);
    var filePath = path.join(exports.dataDir, id + '.txt');
    console.log(filePath);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        return err;
      }
      // console.log('file has been saved', text, item);
    });
  });
  // items[id] = text;
  // console.log(id);
  // console.log(items);

  callback(null, { id, text });
};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
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
