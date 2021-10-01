var models = require('../models');

module.exports = {
  get: (req, res) =>  {
    const productId = req.query.product_id;
    models.questions.fetch(productId, (err, results) => {
      if (err) {
        res.status(500).send('Error getting data from db: ', err);
      } else {
        console.log('THIS IS RESULTS FROM QUESTIONS.FETCH: ', results);
        res.status(200).send(results);
      }
    });
  },
  post: (req, res) => {
    models.questions.create(params, (err, results) => {
      if (err) {
        res.status(500).send('Error posting data to db: ', err);
      } else {
        res.status(201).send('CREATED');
      }
    });
  },
  put: (req, res) => {
    models.questions.update(params, (err, results) => {
      if (err) {
        res.status(500).send('Error updating data in db: ', err);
      } else {
        res.sendStatus(204);
      }
    });
  }
};