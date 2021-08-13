import { performance } from 'perf_hooks';
import chalk from 'chalk';
import * as TE from 'fp-ts/TaskEither';
import { google, sheets_v4 } from 'googleapis';
import { GaxiosResponse } from 'googleapis-common';
import Schema$ValueRange = sheets_v4.Schema$ValueRange;

const getSheets = async (
  spreadsheetId: string,
  range: string,
): Promise<GaxiosResponse<Schema$ValueRange>> => {
  const startTime = performance.now();
  const auth = new google.auth.GoogleAuth({
    keyFile: '/var/run/secrets/app/.gcp-ncrc-key.json',
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  google.options({ auth });
  return google.sheets('v4').spreadsheets.values.get({ spreadsheetId, range }).finally(() => {
    if (process.env.INGEST_DEBUG !== undefined) {
      const endTime = performance.now();
      process.stdout.write(chalk.yellow(`Fetched Google sheet ${spreadsheetId}/${range} (${Math.round(endTime - startTime)}ms)\n`));
    }
  });
};

export type FetchGoogleSheet = (
  spreadsheetId: string,
  range: string,
) => TE.TaskEither<string, GaxiosResponse<Schema$ValueRange>>;

export const fetchGoogleSheet: FetchGoogleSheet = (spreadsheetId, range) => (
  TE.tryCatch(
    async () => getSheets(spreadsheetId, range),
    String,
  )
);
