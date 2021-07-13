import { Buffer } from 'buffer';
import fs from 'fs';
import csvParseSync from 'csv-parse/lib/sync';
import * as D from 'fp-ts/Date';
import * as E from 'fp-ts/Either';
import * as Eq from 'fp-ts/Eq';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as t from 'io-ts';
import { DateFromISOString } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as RI from '../types/review-id';

type Evaluation = {
  date: Date,
  articleDoi: string,
  evaluationLocator: string,
};

export type Evaluations = ReadonlyArray<Evaluation>;

const byDateAscending: Ord.Ord<Evaluation> = pipe(
  D.Ord,
  Ord.contramap((ev) => ev.date),
);

const byArticleLocatorAscending: Ord.Ord<Evaluation> = pipe(
  S.Ord,
  Ord.contramap((ev) => ev.articleDoi),
);

const eqEval: Eq.Eq<Evaluation> = Eq.struct({
  date: D.Eq,
  articleDoi: S.Eq,
  evaluationLocator: S.Eq,
});

const reviews = t.readonlyArray(t.tuple([
  DateFromISOString,
  DoiFromString,
  RI.reviewIdCodec,
]));

export const fromFile = (path: string): TE.TaskEither<string, Evaluations> => pipe(
  path,
  TE.taskify(fs.readFile),
  T.map(E.orElse(() => E.right(Buffer.from('')))),
  TE.chainEitherKW(flow(
    (fileContents) => csvParseSync(fileContents, { fromLine: 2 }) as unknown,
    reviews.decode,
  )),
  TE.bimap(
    (errors) => PR.failure(errors).join(', '),
    RA.map(([date, articleDoi, evaluationLocator]) => ({
      date,
      articleDoi: articleDoi.value,
      evaluationLocator: RI.serialize(evaluationLocator),
    })),
  ),
);

export const toCsv = (evaluations: Evaluations): string => pipe(
  evaluations,
  RA.sortBy([byDateAscending, byArticleLocatorAscending]),
  RA.uniq(eqEval),
  RA.map((evaluation) => (
    `${evaluation.date.toISOString()},${evaluation.articleDoi},${evaluation.evaluationLocator}\n`
  )),
  (events) => `Date,Article DOI,Review ID\n${events.join('')}`,
);
