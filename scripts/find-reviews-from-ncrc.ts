import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import Sheets = sheets_v4.Sheets;

const getSheets = (): Sheets => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '/var/run/secrets/app/.gcp-ncrc-key.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  google.options({
    auth,
  });

  return google.sheets('v4');
};

void (async (): Promise<void> => {
  process.stdout.write('Date,Article DOI,Review ID\n');

  await pipe(
    getSheets(),
    TE.right,
    TE.chain((sheets) => TE.tryCatch(
      async () => sheets.spreadsheets.values.get({
        spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
        range: 'Sheet1!A370:S370',
      }),
      constant('unavailable' as const),
    )),
    T.map(E.chain(flow(
      (res) => res?.data?.values,
      O.fromNullable,
      O.map(RA.map(flow(
        RA.map(String),
        (row) => ({
          date: RA.lookup(18)(row),
          link: RA.lookup(6)(row),
          id: RA.lookup(0)(row),
        }),
        sequenceS(O.option),
      ))),
      O.map(RA.compact),
      E.fromOption(constant('unavailable' as const)),
    ))),
    T.map(E.fold(
      () => {
        process.stderr.write('error');
      },
      RA.map((ncrcReview) => {
        const [, doiSuffix] = new RegExp('.*/([^/]*)$').exec(ncrcReview.link) ?? [];
        return process.stdout.write(`${ncrcReview.date},10.1101/${doiSuffix},ncrc:${ncrcReview.id}\n`);
      }),
    )),
  )();
})();
