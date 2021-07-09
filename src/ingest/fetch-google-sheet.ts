import * as TE from 'fp-ts/TaskEither';
import { google, sheets_v4 } from 'googleapis';
import { GaxiosResponse } from 'googleapis-common';
import Schema$ValueRange = sheets_v4.Schema$ValueRange;

const getSheets = async (
  spreadsheetId: string,
  range: string,
): Promise<GaxiosResponse<Schema$ValueRange>> => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '/var/run/secrets/app/.gcp-ncrc-key.json',
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  google.options({ auth });
  return google.sheets('v4').spreadsheets.values.get({ spreadsheetId, range });
};

export const fetchGoogleSheet = (
  spreadsheetId: string,
  range: string,
): TE.TaskEither<string, GaxiosResponse<Schema$ValueRange>> => TE.tryCatch(
  async () => getSheets(spreadsheetId, range),
  String,
);
