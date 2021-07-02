import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import Sheets = sheets_v4.Sheets;
import {FetchEvaluations} from './update-all';

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

const reviewFromRow = flow(
  RA.map(String),
  (row) => ({
    date: RA.lookup(18)(row),
    link: RA.lookup(6)(row),
    id: RA.lookup(0)(row),
    journal: RA.lookup(14)(row),
  }),
  sequenceS(O.Apply),
);

export const fetchNcrcEvaluations = (): FetchEvaluations => pipe(
  getSheets(),
  TE.right,
  TE.chain((sheets) => TE.tryCatch(
    async () => sheets.spreadsheets.values.get({
      spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
      range: 'Sheet1!A2:S',
    }),
    flow(E.toError, (error) => error.toString()),
  )),
  TE.chainEitherK(flow(
    (res) => res?.data?.values,
    O.fromNullable,
    O.map(flow(
      RA.map(reviewFromRow),
      RA.compact,
      RA.filter((row) => /(biorxiv|medrxiv)/i.test(row.journal)),
    )),
    E.fromOption(() => 'Values not provided'),
  )),
  TE.map(RA.map((ncrcReview) => {
    const [, doiSuffix] = new RegExp('.*/([^/]*)$').exec(ncrcReview.link) ?? [];
    return {
      date: new Date(ncrcReview.date),
      articleDoi: `10.1101/${doiSuffix}`,
      evaluationLocator: `doi:${ncrcReview.id}`,
    };
  })),
);
