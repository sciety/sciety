import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import { GaxiosResponse } from 'googleapis-common';
import Sheets = sheets_v4.Sheets;
import Schema$ValueRange = sheets_v4.Schema$ValueRange;

const getSheets = (): Sheets => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '/var/run/secrets/app/.gcp-ncrc-key.json',
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  google.options({ auth });
  return google.sheets('v4');
};

export const fetchGoogleSheet = (
  spreadsheetId: string,
  range: string,
): TE.TaskEither<string, GaxiosResponse<Schema$ValueRange>> => pipe(
  getSheets(),
  TE.right,
  TE.chain((sheets) => TE.tryCatch(
    async () => sheets.spreadsheets.values.get({ spreadsheetId, range }),
    flow(E.toError, (error) => error.toString()),
  )),
);
