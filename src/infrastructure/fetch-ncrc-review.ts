import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { google, sheets_v4 } from 'googleapis';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { constructNcrcReview, NcrcReview } from './construct-ncrc-review';
import { EvaluationFetcher } from './fetch-review';
import { Logger } from './logger';
import { sheetId } from '../third-parties/ncrc/sheet-id';
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

// row array can be shorter if end column(s) are empty, so response will be shorter: a tuple is wrong in this case
const ncrcSheet = t.array(tuple([
  t.string, // A uuid
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
]));

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
      // implication: if any of the rows don't match the codec we fail the whole sheet
      decoder.decode,
      E.mapLeft(PR.failure),
      E.mapLeft((errors) => {
        logger('error', 'Invalid response from Google sheet api', { res, errors });
        return DE.unavailable;
      }),
    )),
  );
};

type FindableNcrcReview = NcrcReview & { uuid: string };

const getSheet = (logger: Logger): TE.TaskEither<DE.DataError, ReadonlyArray<FindableNcrcReview>> => pipe(
  querySheet(logger)({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:X',
  }, ncrcSheet),
  TE.map((rows) => {
    logger('debug', 'Fetched NCRC Google Sheet', { rowNumber: rows.length });
    return rows;
  }),
  TE.map(
    RA.map((row) => ({
      uuid: row[0],
      title: row[2],
      ourTake: row[7],
      studyDesign: row[21],
      studyPopulationSetting: row[9],
      mainFindings: row[10],
      studyStrength: row[11],
      limitations: row[12],
      valueAdded: row[8],
    })),
  ),
);

let cache: Promise<E.Either<DE.DataError, ReadonlyArray<FindableNcrcReview>>>;

const cachedGetSheet = (logger: Logger): TE.TaskEither<DE.DataError, ReadonlyArray<FindableNcrcReview>> => async () => {
  if (cache === undefined || E.isLeft(await cache)) {
    cache = getSheet(logger)();
  }
  return cache;
};

export const fetchNcrcReview = (logger: Logger): EvaluationFetcher => (evaluationUuid: string) => pipe(
  cachedGetSheet(logger),
  TE.chainEitherKW(flow(
    RA.findFirst((row) => row.uuid === evaluationUuid),
    E.fromOption(() => {
      logger('error', 'NCRC evaluation id not found in cached sheet', { evaluationUuid });
      return DE.notFound;
    }),
  )),
  TE.map(constructNcrcReview),
);
