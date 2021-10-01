var db = require('../db');

module.exports = {
  fetch: (questionId, callback) => {
    // fetch all answers for a give question_id
    /*
      SELECT answers.id answer_id, body, date, answerer_name, helpfulness,
        COALESCE(json_agg(json_build_object('id', photos.id, 'url', url)) FILTER (WHERE photos.id IS NOT NULL), '[]') photos
      FROM answers
      LEFT OUTER JOIN photos
      ON answers.id = photos.answer_id
      WHERE question_id = 1 AND answers.reported = FALSE
      GROUP BY answers.id, body, date, answerer_name, helpfulness
    */
    var query = {
      text: `SELECT answers.id answer_id, body, date, answerer_name, helpfulness, COALESCE(json_agg(json_build_object('id', photos.id, 'url', url)) FILTER (WHERE photos.id IS NOT NULL), '[]') photos FROM answers LEFT OUTER JOIN photos ON answers.id = photos.answer_id WHERE question_id = $1 AND answers.reported = FALSE GROUP BY answers.id, body, date, answerer_name, helpfulness`,
      values: [questionId],
    }
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
      });
  },
  create: (params, callback) => {
    // create an answer for the given question_id
    var query = {
      text: ``,
      values: [],
    }
    db.query(query, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  },
  update: (params, callback) => {
    // update report of helpful for a given answer
    var query = {
      text: ``,
      values: [],
    }
    db.query(query, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  }
};