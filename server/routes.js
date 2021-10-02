var controller = require('./controllers');
var router = require('express').Router();

//Connect controller methods to their corresponding routes

//List Questions. Status 200 OK
router.get('/questions', controller.questions.get);

//Answers List. Status 200 OK
router.get('/questions/:question_id/answers', controller.answers.get);

//Add a Question. Status 201 CREATED
router.post('/questions', controller.questions.post);

//Add an Answer. Status 201 CREATED
router.post('/questions/:question_id/answers', controller.answers.post);

//Mark a Question as Helpful. Status 204 NO CONTENT
router.put('/questions/:question_id/helpful', controller.questions.putHelpful);

//Report a Question. Status 204 NO CONTENT
router.put('/questions/:question_id/report', controller.questions.putReport);

//Mark an Answer as Helpful. Status 204 NO CONTENT
router.put('/answers/:answer_id/helpful', controller.answers.putHelpful);

//Report an Answer. Status 204 NO CONTENT
router.put('/answers/:answer_id/report', controller.answers.putReport);

module.exports = router;

