import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import { constructNcrcReview } from './construct-ncrc-review';
import { Logger } from './logger';
import { HtmlFragment } from '../types/html-fragment';
import * as NcrcId from '../types/ncrc-id';
import Params$Resource$Spreadsheets$Values$Get = sheets_v4.Params$Resource$Spreadsheets$Values$Get;

type FoundReview = {
  fullText: HtmlFragment,
  url: URL,
};

export type FetchNcrcReview = (id: NcrcId.NcrcId) => TE.TaskEither<'unavailable' | 'not-found', FoundReview>;

const querySheet = (logger: Logger) => (params: Params$Resource$Spreadsheets$Values$Get) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '/var/run/secrets/app/.gcp-ncrc-key.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  google.options({
    auth,
  });

  return pipe(
    TE.tryCatch(
      async () => google.sheets('v4').spreadsheets.values.get(params),
      (error) => {
        logger('error', 'Error fetching Google sheet', { error });
        return 'unavailable' as const;
      },
    ),
    T.map(E.chain((res) => pipe(
      res?.data?.values,
      O.fromNullable,
      O.chain(RNEA.fromArray),
      O.altW(() => {
        logger('error', 'Empty response from Google sheet api', { res });
        return O.none;
      }),
      E.fromOption(constant('unavailable' as const)),
    ))),
  );
};

const getRowNumber = (logger: Logger) => (id: NcrcId.NcrcId) => pipe(
  querySheet(logger)({
    spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
    range: 'Sheet1!A:A',
    majorDimension: 'COLUMNS',
  }),
  T.map(E.chainW(flow(
    RNEA.head,
    RA.findIndex((uuid) => NcrcId.eqNcrcId.equals(NcrcId.fromString(uuid), id)),
    O.map((n) => n + 1),
    O.altW(() => {
      logger('error', 'Cannot find NcrcId in NCRC sheet', {
        ncrcId: id.value,
      });
      return O.none;
    }),
    E.fromOption(constant('not-found' as const)),
  ))),
);

const getNcrcReview = (logger: Logger) => (rowNumber: number) => pipe(
  querySheet(logger)({
    spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
    range: `Sheet1!A${rowNumber}:AF${rowNumber}`,
  }),
  T.map(E.chain(flow(
    RNEA.head,
    (row) => ({
      title: RA.lookup(2)(row),
      ourTake: RA.lookup(7)(row),
      studyDesign: RA.lookup(21)(row),
      studyPopulationSetting: RA.lookup(9)(row),
      mainFindings: RA.lookup(10)(row),
      studyStrength: RA.lookup(11)(row),
      limitations: RA.lookup(12)(row),
      valueAdded: RA.lookup(8)(row),
    }),
    sequenceS(O.option),
    E.fromOption(constant('unavailable' as const)),
  ))),
);

export const fetchNcrcReview = (logger: Logger): FetchNcrcReview => flow(
  TE.right,
  TE.chain(getRowNumber(logger)),
  TE.chainW(getNcrcReview(logger)),
  TE.map(constructNcrcReview),
);
