import { performance } from 'perf_hooks';
import { auth, sheets } from '@googleapis/sheets';
import * as TE from 'fp-ts/TaskEither';

const getSheets = async (
  spreadsheetId: string,
  range: string,
) => {
  const startTime = performance.now();
  const myauth = new auth.GoogleAuth({
    keyFile: '/var/run/secrets/app/.gcp-ncrc-key.json',
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });
  return sheets({ version: 'v4', auth: myauth }).spreadsheets.values.get({ spreadsheetId, range }).finally(() => {
    if (process.env.INGEST_DEBUG && process.env.INGEST_DEBUG.length > 0) {
      const endTime = performance.now();
      process.stdout.write(`Fetched Google sheet ${spreadsheetId}/${range} (${Math.round(endTime - startTime)}ms)\n`);
    }
  });
};

export type FetchGoogleSheet = (
  spreadsheetId: string,
  range: string,
) => TE.TaskEither<string, Awaited<ReturnType<typeof getSheets>>>;

export const fetchGoogleSheet: FetchGoogleSheet = (spreadsheetId, range) => (
  TE.tryCatch(
    async () => getSheets(spreadsheetId, range),
    String,
  )
);
