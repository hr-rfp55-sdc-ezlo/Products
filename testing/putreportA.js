import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1500,
  duration: '60s',
};

export default function () {
  // var answerId = ?; //top
  // var answerId= ?; //bottom
  // var answerId= ?; //mid

  var url = `http://localhost:3000/qa/answers/${answerId}/report`;

  http.put(url);
  sleep(1);
}