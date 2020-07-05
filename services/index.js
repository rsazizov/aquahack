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
  if (!token) {
    // TODO: Error
  }

  const headers = new Headers();

  const creds = token + ":";
  const buf = new Buffer(creds);
  let creds64 = buf.toString('base64');

  headers.set('Authorization', 'Basic ' + creds64);

  return fetch(api + 'field', {
    headers: headers
  }).then(res => res.json());
}

export function addField(name, gps, area, crop) {
  const headers = new Headers();

  const creds = token + ":";
  const buf = new Buffer(creds);
  let creds64 = buf.toString('base64');

  // headers.append('Authorization', 'Basic ' + creds64);
  headers.set('Content-Type', 'application/json');

  return fetch(api + 'field', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      name,
      lat: gps.lat,
      lon: gps.lon,
      area,
      crop
    })
  }).then(res => res.json());
}