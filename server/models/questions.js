var db = require('../db');

module.exports = {

  fetch: function (productId, callback) {
    // fetch all questions for a given product_id
    var query = {
      /* OPTION 1. Need to pass down the question_id to reduce query time
      SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, reported, a.answers
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
      WHERE product_id = 1 AND reported = FALSE;
      text:"SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, reported, a.answers FROM questions q LEFT OUTER JOIN (SELECT question_id, json_object_agg(id, row_to_json(ap)::jsonb - 'question_id') answers FROM (SELECT question_id, answers.id, body, date, answerer_name, helpfulness, ARRAY_AGG (row_to_json(photos)::jsonb - 'answer_id') photos FROM answers LEFT OUTER JOIN photos ON answers.id = photos.answer_id GROUP BY question_id, answers.id, body, date, answerer_name, helpfulness) ap WHERE question_id = 4 GROUP BY question_id) a ON q.question_id = a.question_id WHERE product_id = 1 AND reported = FALSE",
      */
      /* OPTION 2: join 3 tables first then reformat the data. ISSUE: answer_id can be null for questions with no answer...
      SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, json_object_agg(answer_id, json_build_object('answer_id', answer_id, 'body', body, 'date', date, 'answerer_name', answerer_name, 'helpfulness', helpfulness, 'photos', photos)) answers
      FROM
      (SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness, json_agg(json_build_object('id', id, 'url', url)) photos
      FROM
      (SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, q.reported, a.id answer_id, body, date, answerer_name, helpfulness, p.id, url
      FROM questions q
      LEFT OUTER JOIN answers a
      ON q.question_id = a.question_id
      LEFT OUTER JOIN photos p
      ON a.id = p.answer_id
      WHERE product_id =1 and q.reported = FALSE) t1
      GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness) t2
      GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported
      */
      text:"SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, json_agg(json_build_object('answer_id', answer_id, 'body', body, 'date', date, 'answerer_name', answerer_name, 'helpfulness', helpfulness, 'photos', photos)) answers FROM (SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness, json_agg(json_build_object('id', id, 'url', url)) photos FROM (SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, q.reported, a.id answer_id, body, date, answerer_name, helpfulness, p.id, url FROM questions q LEFT OUTER JOIN answers a ON q.question_id = a.question_id LEFT OUTER JOIN photos p ON a.id = p.answer_id WHERE product_id = $1 and q.reported = FALSE) t1 GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness) t2 GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported",
      values: [productId],
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