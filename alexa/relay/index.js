// McGaw Lists — Alexa relay.
// Paste this into the skill's Code tab (Alexa-hosted), replacing everything in index.js, then Deploy.
// It passes each Alexa request on to the Supabase "alexa" function and hands back the reply.
const https = require('https');

// ↓↓ Fill these two in ↓↓
const SUPABASE_URL = 'https://rnbmjcnihhfphfdseoyd.supabase.co/functions/v1/alexa';
const SECRET_WORD = 'PUT-YOUR-SECRET-WORD-HERE'; // the same as ALEXA_URL_KEY in Supabase

function post(body) {
  return new Promise((resolve, reject) => {
    const req = https.request(SUPABASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'x-mcgaw-key': SECRET_WORD },
      timeout: 7000,
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(body);
  });
}

const say = (text) => ({ version: '1.0', response: { outputSpeech: { type: 'PlainText', text }, shouldEndSession: true } });

exports.handler = async (event) => {
  try {
    const { status, data } = await post(JSON.stringify(event));
    if (status === 200) return JSON.parse(data);
    console.log('Supabase replied', status, data.slice(0, 300));
    if (status === 404) return say('McGaw Lists: the secret word in the relay doesn’t match Supabase.');
    if (status === 403) return say('McGaw Lists: Supabase doesn’t recognise this skill. Check the skill ID secret.');
    return say('Sorry, McGaw Lists had a problem. Try again in a moment.');
  } catch (e) {
    console.log('Relay error', e);
    return say('Sorry, I couldn’t reach McGaw Lists just now.');
  }
};
