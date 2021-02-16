import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: '.gcp-ncrc-key.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
});

google.options({
  auth,
});

const sheets = google.sheets('v4');
sheets.spreadsheets.values.get({
  spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
  range: 'Sheet1!A370:AF370',
}, (err, res) => {
  /* eslint-disable no-console */
  if (err) return console.log(`The API returned an error: ${err.toString()}`);
  const rows = res?.data?.values;
  console.log(rows);
});
