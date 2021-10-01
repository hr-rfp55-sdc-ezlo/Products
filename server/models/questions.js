var db = require('../db');

module.exports = {
  fetch: function (productId, callback) {
    // fetch all questions for a given product_id
    /* Join 3 tables -> aggregate photos' columns by answer_id -> aggregate answers' columns by question_id

    SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported,
    COALESCE(json_object_agg(answer_id, json_build_object('id', answer_id, 'body', body, 'date', date, 'answerer_name', answerer_name, 'helpfulness', helpfulness, 'photos', photos)) FILTER (WHERE answer_id IS NOT NULL), '{}') answers
    FROM
    (
      SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness,
      COALESCE(json_agg(json_build_object('id', id, 'url', url)) FILTER (WHERE id IS NOT NULL), '[]') photos
      FROM
      (
        SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, q.reported, a.id answer_id, body, date, answerer_name, helpfulness, p.id, url
        FROM questions q
        LEFT OUTER JOIN answers a
        ON q.question_id = a.question_id
        LEFT OUTER JOIN photos p
        ON a.id = p.answer_id
        WHERE product_id =1 AND q.reported = FALSE AND a.reported = FALSE
      ) t1
      GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness
    ) t2
        GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported
    */
    var query = {
      text:`SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, COALESCE(json_object_agg(answer_id, json_build_object('id', answer_id, 'body', body, 'date', date, 'answerer_name', answerer_name, 'helpfulness', helpfulness, 'photos', photos)) FILTER (WHERE answer_id IS NOT NULL), '{}') answers FROM (SELECT question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness, COALESCE(json_agg(json_build_object('id', id, 'url', url)) FILTER (WHERE id IS NOT NULL), '[]') photos FROM (SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, q.reported, a.id answer_id, body, date, answerer_name, helpfulness, p.id, url FROM questions q LEFT OUTER JOIN answers a ON q.question_id = a.question_id LEFT OUTER JOIN photos p ON a.id = p.answer_id WHERE product_id = $1 AND q.reported = FALSE AND a.reported = FALSE) t1 GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported, answer_id, body, date, answerer_name, helpfulness) t2 GROUP BY question_id, question_body, question_date, asker_name, question_helpfulness, reported`,
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
  create: (params, callback) => {
    // create a question for the given product_id
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
    // update report or helpful for a given question_id
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

/* ANOTHER QUERY OPTION for FETCH: Join answers and photos tables -> aggregate photos' columns by answer_id -> aggregate answers' columns by question_id -> join with questions table. Issue: Query time too long. Need to find ways to pass down the question_id to reduce query time

SELECT q.question_id, question_body, question_date, asker_name, question_helpfulness, reported, a.answers
FROM questions q
LEFT OUTER JOIN
  (SELECT question_id, json_object_agg(id, row_to_json(ap)::jsonb - 'question_id') answers
    FROM
      (SELECT question_id, answers.id, body, date, answerer_name, helpfulness,
        COALESCE(json_agg(json_build_object('id', photos.id, 'url', url)) FILTER (WHERE photos.id IS NOT NULL), '[]') photos
      FROM answers
      LEFT OUTER JOIN photos
      ON answers.id = photos.answer_id
      WHERE answers.reported = FALSE
      GROUP BY question_id, answers.id, body, date, answerer_name, helpfulness) ap
      GROUP BY question_id
  ) a
ON q.question_id = a.question_id
WHERE product_id = 1 AND reported = FALSE;
*/