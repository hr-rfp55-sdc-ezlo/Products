var models = require('../models');

module.exports = {
  get: (req, res) =>  {
    const productId = req.query.product_id;
    if (productId === undefined) {
      res.status(404).send('Missing product_id');
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
    console.log('THIS IS REQ.BODY: ', req.body);
    models.questions.create(req.body, (err) => {
      if (err) {
        res.status(500).send('Error posting question to db: ', err);
      } else {
        res.status(201).send('CREATED');
      }
    });
  },
  put: (req, res) => {
    models.questions.update(params, (err, results) => {
      if (err) {
        res.status(500).send('Error updating question in db: ', err);
      } else {
        res.sendStatus(204);
      }
    });
  }
};