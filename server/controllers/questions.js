var models = require('../models');

module.exports = {
  get: function (req, res) {
    models.questions.fetch(function(err, results) {
      if (err) { /* do something */ }
      res.send(results);
    });
  },
  post: function (req, res) {
    models.questions.create(params, function(err, results) {
      if (err) { /* do something */ }
      res.sendStatus(201);
    });
  },
  put: function (req, res) {
    models.questions.update(params, function(err, results) {
      if (err) { /* do something */ }
      res.sendStatus(204);
    });
  }
};