var models = require('../models');

module.exports = {
  get: (req, res) => {
    const questionId = req.params.question_id;
    if (isNaN(Number(questionId))) {
      res.status(400).send('Missing question_id');
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
    const questionId = req.params.question_id;
    if (isNaN(Number(questionId))) {
      res.status(400).send('Missing question_id');
    } else {
      const { body, name, email, photos } = req.body;
      const checkType = typeof body === 'string' && typeof name === 'string' && typeof email === 'string' && Array.isArray(photos)
      if (!checkType || body.length === 0 || name.length === 0 || email.length === 0){
        res.status(400).send('Error with body params: missing param, incorrect type, empty string')
      } else {
        models.answers.create({ body, name, email, photos, questionId }, (err) => {
          if (err) {
            res.status(500).send('Error posting answer to db: ', err);
          } else {
            res.sendStatus(201);
          }
        });
      }
    }
  },
  putHelpful: (req, res) => {
    const answerId = req.params.answer_id;
    if (isNaN(Number(answerId))) {
      res.status(400).send('Missing answer_id');
    } else {
      models.answers.update('helpfulness', answerId, (err) => {
        if (err) {
          res.status(500).send(`Error updating answer's helpfulness in db: `, err);
        } else {
          res.sendStatus(204);
        }
      });
    }
  },

  putReport: (req, res) => {
    const answerId = req.params.answer_id;
    if (isNaN(Number(answerId))) {
      res.status(400).send('Missing answer_id');
    } else {
      models.answers.update('reported', answerId, (err) => {
        if (err) {
          res.status(500).send('Error reporting answer in db: ', err);
        } else {
          res.sendStatus(204);
        }
      });
    }
  }
};