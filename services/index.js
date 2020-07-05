import { Buffer } from 'buffer';

const api = 'http://192.168.1.66:5000/api/'
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

export function getFields() {
  return fetch(api + 'field').then(res => res.json());
}

export function addField(name, gps, area, crop) {
  return fetch(api + 'field', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      lat: gps.lat,
      lon: gps.lon,
      area,
      crop
    })
  }).then(res => res.json());
}