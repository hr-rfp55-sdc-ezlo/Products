import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1500,
  duration: '60s',
};

export default function () {
  // var productId = ?; //top
  // var productId = ?; //bottom
  // var productId = ?; //mid

  var url = 'http://localhost:3000/qa/questions';
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, params);
  sleep(1);
}