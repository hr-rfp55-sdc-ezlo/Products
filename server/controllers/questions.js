var models = require('../models');

module.exports = {
  get: (req, res) =>  {
    const productId = req.query.product_id;
    if (productId === undefined) {
      res.status(400).send('Missing product_id');
    } else {
      models.questions.fetch(productId, (err, results) => {
        if (err) {
          res.status(500).send('Error getting data from db: ', err);
        } else {
          res.status(200).send(results);
        }
      });
    }
  },

  post: (req, res) => {
    const { body, name, email, product_id } = req.body;
    const checkType = typeof body === 'string' && typeof name === 'string' && typeof email === 'string' && typeof product_id === 'number'
    if (!checkType || body.length === 0 || name.length === 0 || email.length === 0){
      res.status(400).send('Error with body params: missing param, incorrect type, empty string')
    } else {
      models.questions.create({ body, name, email, product_id }, (err) => {
        if (err) {
          res.status(500).send('Error posting question to db: ', err);
        } else {
          res.status(201).send('CREATED');
        }
      });
    }
  },

  putHelpful: (req, res) => {
    const questionId = req.params.question_id;
    if (isNaN(Number(questionId))) {
      res.status(400).send('Missing question_id');
    } else {
      models.questions.update('question_helpfulness', questionId, (err) => {
        if (err) {
          res.status(500).send(`Error updating question's helpfulness in db: `, err);
        } else {
          res.sendStatus(204);
        }
      });
    }
  },

  putReport: (req, res) => {
    const questionId = req.params.question_id;
    if (isNaN(Number(questionId))) {
      res.status(400).send('Missing question_id');
    } else {
      models.questions.update('reported', questionId, (err) => {
        if (err) {
          res.status(500).send('Error reporting question in db: ', err);
        } else {
          res.sendStatus(204);
        }
      });
    }
  }
};