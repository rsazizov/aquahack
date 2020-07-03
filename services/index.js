import { Buffer } from 'buffer';

let api = 'http://192.168.1.66:5000/api/'
let token = null;

export function getToken(username, password) {
  const headers = new Headers();

  const creds = username + ":" + password;
  const buf = new Buffer(creds);
  let creds64 = buf.toString('base64');

  headers.set('Authorization', 'Basic ' + creds64);

  return fetch(api + 'token', {
    method: "GET",
    headers: headers
  }).then(res => res.json())
    .then(json => token = json.token);
}