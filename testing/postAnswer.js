import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000,
  duration: '60s',
};

export default function () {
  var questionId = 3518964;

  var url = `http://localhost:3000/qa/questions/${questionId}/answers`;

  var data = {
    body: 'k6test',
    name: 'k6test',
    email: 'k6test@test.com',
    photos: ['x', 'y', 'z']
  };

  http.post(url, data);
  sleep(1);
}

//  k6 run testing/postAnswer.js to execute the test;