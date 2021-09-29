var db = require('../db');

module.exports = {

  fetch: function (callback) {
    // fetch all questions for a given product_id
    // var queryStr = 'select messages.id, messages.text, messages.roomname, users.username \
    //                 from messages left outer join users on (messages.userid = users.id) \
    //                 order by messages.id desc';
    // db.query(queryStr, function(err, results) {
    //   callback(err, results);
    // });
  },
  create: function (params, callback) {
    // create a question for the given product_id
  },
  update: function (params, callback) {
    // update report or helpful for a given question_id
  }
  };