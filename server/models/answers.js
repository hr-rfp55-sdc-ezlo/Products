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

  create: ({ body, name, email, photos, questionId }, callback) => {
    // create an answer for the given question_id
    const answerInfo = [body, name, email, questionId];
    let photoInfo = photos;
    let startStr = '';
    let endStr = '';
    if (photos.length) {
      startStr = `WITH a AS (`;
      endStr = ` RETURNING id) INSERT INTO photos (url, answer_id) VALUES `
      photos.forEach((photo, index) => {
        if (index === photos.length - 1) {
          endStr += `($${index + 5}, (SELECT id FROM a))`
        } else {
          endStr += `($${index + 5}, (SELECT id FROM a)), `;
        }
      });
    }
    var query = {
      /*
      WITH a AS
        (INSERT INTO answers (body, answerer_name, answerer_email, question_id)
         VALUES ($1, $2, $3, $4)
         RETURNING id)
      INSERT INTO photos (url, answer_id)
      VALUES ($5, SELECT id FROM a), ($6, SELECT id FROM a), ($7, SELECT id FROM a), ($8, SELECT id FROM a), ($9, SELECT id FROM a)
      */
      text: `${startStr}INSERT INTO answers (body, answerer_name, answerer_email, question_id) VALUES ($1, $2, $3, $4)${endStr}`,
      values: answerInfo.concat(photoInfo),
    }
    db.query(query, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null);
      }
    });
  },

  update: (colName, answerId, callback) => {
    // update report of helpful for a given answer
    let text = '';
    if (colName === 'reported') {
      text = `UPDATE answers SET reported = TRUE WHERE id = $1`;
    } else {
      text = `UPDATE answers SET helpfulness = helpfulness + 1 WHERE id = $1`;
    }
    var query = {
      text,
      values: [answerId],
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