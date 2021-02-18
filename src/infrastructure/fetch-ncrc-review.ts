import { URL } from 'url';
import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import { Logger } from './logger';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import * as NcrcId from '../types/ncrc-id';
import Sheets = sheets_v4.Sheets;

export type NcrcReview = {
  title: string,
  ourTake: string,
  studyDesign: string,
  studyPopulationSetting: string,
  mainFindings: string,
  studyStrength: string,
  limitations: string,
  valueAdded: string,
};

type FoundReview = {
  fullText: HtmlFragment,
  url: URL,
};

export type FetchNcrcReview = (id: NcrcId.NcrcId) => TE.TaskEither<'unavailable' | 'not-found', FoundReview>;

type GetRowNumber = (id: NcrcId.NcrcId) => TE.TaskEither<'unavailable' | 'not-found', number>;

type GetNcrcReview = (row: number) => TE.TaskEither<'unavailable' | 'not-found', NcrcReview>;

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

const getRowNumber = (logger: Logger): GetRowNumber => (id) => pipe(
  getSheets(),
  TE.right,
  TE.chain((sheets) => TE.tryCatch(
    async () => sheets.spreadsheets.values.get({
      spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
      range: 'Sheet1!A:A',
      majorDimension: 'COLUMNS',
    }),
    (error) => {
      logger('error', 'Error fetching Google sheet', { error });
      return 'unavailable' as const;
    },
  )),
  T.map(E.chain(flow(
    (res) => res?.data?.values,
    O.fromNullable,
    O.chain(RA.head),
    E.fromOption(constant('unavailable' as const)),
  ))),
  T.map(E.chainW(flow(
    RA.findIndex((uuid) => NcrcId.eqNcrcId.equals(NcrcId.fromString(uuid), id)),
    O.map((n) => n + 1),
    E.fromOption(constant('not-found' as const)),
  ))),
);

const getNcrcReview = (logger: Logger): GetNcrcReview => (rowNumber) => pipe(
  getSheets(),
  TE.right,
  TE.chain((sheets) => TE.tryCatch(
    async () => sheets.spreadsheets.values.get({
      spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
      range: `Sheet1!A${rowNumber}:AF${rowNumber}`,
    }),
    (error) => {
      logger('error', 'Error fetching Google sheet', { error });
      return 'unavailable' as const;
    },
  )),
  T.map(E.chain(flow(
    (res) => res?.data?.values,
    O.fromNullable,
    O.chain(RA.head),
    // TODO: ensure that these are strings (codec?)
    O.chain(flow(
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
    )),
    E.fromOption(constant('unavailable' as const)),
  ))),
);

const slugify = (value: string): string => value.toLowerCase().replace(/\s/g, '-');

// TODO: sanitise/escape the input
const constructFullText = (review: NcrcReview): HtmlFragment => toHtmlFragment(`
  <h3>Our take</h3>
  <p>
    ${review.ourTake}
  </p>
  <h3>Study design</h3>
  <p>
    ${review.studyDesign}
  </p>
  <h3>Study population and setting</h3>
  <p>
    ${review.studyPopulationSetting}
  </p>
  <h3>Summary of main findings</h3>
  <p>
    ${review.mainFindings}
  </p>
  <h3>Study strengths</h3>
  <p>
    ${review.studyStrength}
  </p>
  <h3>Limitations</h3>
  <p>
    ${review.limitations}
  </p>
  <h3>Value added</h3>
  <p>
    ${review.valueAdded}
  </p>
`);

export const constructFoundReview = (review: NcrcReview): FoundReview => ({
  url: new URL(`https://ncrc.jhsph.edu/research/${slugify(review.title)}/`),
  fullText: constructFullText(review),
});

export const fetchNcrcReview = (logger: Logger): FetchNcrcReview => flow(
  TE.right,
  TE.chain(getRowNumber(logger)),
  TE.chain(getNcrcReview(logger)),
  TE.map(constructFoundReview),
);
