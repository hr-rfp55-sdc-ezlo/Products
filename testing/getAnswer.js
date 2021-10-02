import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000,
  duration: '60s',
};

export default function () {
  // var questionId = 36; //top
  var questionId = 3518964; //bottom
  // var questionId = 1740933; //mid

  var url = `http://localhost:3000/qa/questions/${questionId}/answers`;
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.get(url, params);
  sleep(1);
}

//  k6 run testing/getAnswer.js to execute the test;