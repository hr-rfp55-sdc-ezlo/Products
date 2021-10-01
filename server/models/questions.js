var db = require('../db');

module.exports = {

  fetch: function (productId, callback) {
    // fetch all questions for a given product_id
    var query = {
      // text: 'SELECT questions.question_id, question_body, question_date, asker_name, question_helpfulness, questions.reported, ARRAY_AGG (row_to_json(answers_short)) answers FROM questions INNER JOIN (SELECT question_id, id, body, date, answerer_name, helpfulness FROM answers) answers_short ON questions.question_id = answers_short.question_id WHERE product_id = $1 AND questions.reported = FALSE GROUP BY questions.question_id, question_body, question_date, asker_name, question_helpfulness, questions.reported',
      // text: 'SELECT questions.question_id, question_body, question_date, asker_name, question_helpfulness, questions.reported, ARRAY_AGG (row_to_json(ap)) answers FROM questions LEFT OUTER JOIN (SELECT answers.question_id, answers.id, body, date, answerer_name, helpfulness, ARRAY_AGG (row_to_json(photos)) photos FROM answers LEFT OUTER JOIN photos ON answers.id = photos.answer_id GROUP BY answers.question_id, answers.id, body, date, answerer_name, helpfulness) ap ON questions.question_id = ap.question_id WHERE product_id = $1 AND questions.reported = FALSE GROUP BY questions.question_id, question_body, question_date, asker_name, question_helpfulness, questions.reported',
      // text: 'SELECT questions.question_id, question_body, question_date, asker_name, question_helpfulness, questions.reported, ARRAY_AGG (row_to_json(c)) (SELECT * FROM questions LEFT OUTER JOIN answers ON questions.question_id = answers.question_id LEFT OUTER JOIN photos ON answers.id = photos.answer_id WHERE product_id = 1 AND questions.reported = FALSE)'
      /*
      text: `
      SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, reported
      FROM questions q
      LEFT OUTER JOIN
        (SELECT question_id, json_object_agg(id, row_to_json(ap)::jsonb - 'question_id') answers
          FROM
            (SELECT question_id, answers.id, body, date, answerer_name, helpfulness, ARRAY_AGG (row_to_json(photos)::jsonb - 'answer_id') photos
            FROM answers
            LEFT OUTER JOIN photos
            ON answers.id = photos.answer_id
            GROUP BY question_id, answers.id, body, date, answerer_name, helpfulness) ap
            WHERE question_id = 1
            GROUP BY question_id
        ) a
      ON q.question_id = a.question_id
      WHERE q.question_id = 1;
      WHERE product_id = 1 AND reported = FALSE;
      `
      */
      text:"SELECT question_id, json_object_agg(id, row_to_json(ap)::jsonb - 'question_id') answers FROM (SELECT question_id, answers.id, body, date, answerer_name, helpfulness, ARRAY_AGG (row_to_json(photos)::jsonb - 'answer_id') photos FROM answers LEFT OUTER JOIN photos ON answers.id = photos.answer_id GROUP BY question_id, answers.id, body, date, answerer_name, helpfulness) ap GROUP BY question_id LEFT OUTER JOIN (SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, reported FROM questions q",
      // values: [productId],
    };
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results.rows);
      }
    });
  },
  create: function (params, callback) {
    // create a question for the given product_id
  },
  update: function (params, callback) {
    // update report or helpful for a given question_id
  }
  };