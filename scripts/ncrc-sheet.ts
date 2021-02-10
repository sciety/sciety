import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: '/home/giorgio/sciety-0b0fcd073bf7.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
});

google.options({
  auth,
});

const sheets = google.sheets('v4');
sheets.spreadsheets.values.get({
  spreadsheetId: '1tDO5yci19_jRsUQY9uAkvga3OY9Jblky2yhknrN1Cww',
  range: 'papers!A2780:AF2780',
}, (err, res) => {
  if (err) return console.log(`The API returned an error: ${err}`);
  const rows = res?.data?.values;
  console.log(rows);
});
