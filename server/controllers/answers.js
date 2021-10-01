var models = require('../models');

module.exports = {
  get: (req, res) => {
    const questionId = req.params.question_id;
    if (isNaN(Number(questionId))) {
      res.status(404).send('Missing question_id');
    } else {
      models.answers.fetch(questionId, (err, results) => {
        if (err) {
          res.status(500).send('Error getting data from db: ', err);
        } else {
          res.status(200).send(results);
        }
      });
    }
  },
  post: (req, res) => {
    models.answers.create(params, (err) => {
      if (err) {
        res.status(500).send('Error posting answer to db: ', err);
      } else {
        res.sendStatus(201);
      }
    });
  },
  put: function (req, res) {
    models.answers.update(params, (err) => {
      if (err) {
        res.status(500).send('Error updating answer in db: ', err);
      } else {
        res.sendStatus(204);
      }
    });
  }
};