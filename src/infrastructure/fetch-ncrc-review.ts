import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { constructNcrcReview } from './construct-ncrc-review';
import { EvaluationFetcher } from './fetch-review';
import { Logger } from './logger';
import * as DE from '../types/data-error';
import Params$Resource$Spreadsheets$Values$Get = sheets_v4.Params$Resource$Spreadsheets$Values$Get;

// https://github.com/gcanti/io-ts/issues/431
type TupleFn = <TCodecs extends readonly [t.Mixed, ...Array<t.Mixed>]>(
  codecs: TCodecs,
  name?: string,
) => t.TupleType<{
  -readonly [K in keyof TCodecs]: TCodecs[K];
}, {
  [K in keyof TCodecs]: TCodecs[K] extends t.Mixed
    ? t.TypeOf<TCodecs[K]>
    : unknown;
}, {
  [K in keyof TCodecs]: TCodecs[K] extends t.Mixed
    ? t.OutputOf<TCodecs[K]>
    : unknown;
}>;
const tuple: TupleFn = t.tuple as never;

const columnType = t.tuple([tt.readonlyNonEmptyArray(t.string)]); // TODO use a uuid

const rowType = t.tuple([tuple([
  t.unknown, // A uuid
  t.unknown, // B title_journal
  t.string, // C Title
  t.unknown, // D Topic
  t.unknown, // E First Author
  t.unknown, // F Date Published
  t.unknown, // G link
  t.string, // H Our Take
  t.string, // I value_added
  t.string, // J study_population_setting
  t.string, // K main_findings
  t.string, // L study_strength
  t.string, // M limitations
  t.unknown, // N (hidden)
  t.unknown, // O journal
  t.unknown, // P cross_post
  t.unknown, // Q edit_finished
  t.unknown, // R reviewer
  t.unknown, // S edit_date
  t.unknown, // T final_take_wordcount
  t.unknown, // U compendium_feature
  t.string, // V Study_Design
  t.unknown, // W Subtopic_Tag
])]);

const querySheet = (logger: Logger) => <A>(
  params: Params$Resource$Spreadsheets$Values$Get,
  decoder: t.Decoder<unknown, A>,
) => {
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
        return DE.unavailable;
      },
    ),
    TE.chainEitherKW((res) => pipe(
      res?.data?.values,
      decoder.decode,
      E.mapLeft(PR.failure),
      E.mapLeft((errors) => {
        logger('error', 'Invalid response from Google sheet api', { res, errors });
        return DE.unavailable;
      }),
    )),
  );
};

const getRowNumber = (logger: Logger) => (key: string) => pipe(
  querySheet(logger)({
    spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
    range: 'Sheet1!A:A', // TODO don't select the header
    majorDimension: 'COLUMNS',
  }, columnType),
  TE.chainEitherKW(flow(
    RNEA.head,
    RA.findIndex((uuid) => uuid === key),
    O.map((n) => n + 1),
    O.altW(() => {
      logger('error', 'Cannot find NcrcId in NCRC sheet', {
        ncrcId: key,
      });
      return O.none;
    }),
    E.fromOption(() => DE.notFound),
  )),
);

const getNcrcReview = (logger: Logger) => flow(
  (rowNumber: number) => querySheet(logger)({
    spreadsheetId: '1RJ_Neh1wwG6X0SkYZHjD-AEC9ykgAcya_8UCVNoE3SA',
    range: `Sheet1!A${rowNumber}:AF${rowNumber}`,
  }, rowType),
  TE.map(flow(
    RNEA.head,
    (row) => ({
      title: row[2],
      ourTake: row[7],
      studyDesign: row[21],
      studyPopulationSetting: row[9],
      mainFindings: row[10],
      studyStrength: row[11],
      limitations: row[12],
      valueAdded: row[8],
    }),
  )),
);

export const fetchNcrcReview = (logger: Logger): EvaluationFetcher => flow(
  getRowNumber(logger),
  TE.chainW(getNcrcReview(logger)),
  TE.map(constructNcrcReview),
);
