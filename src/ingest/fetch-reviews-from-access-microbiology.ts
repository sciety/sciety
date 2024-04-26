import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { Evaluation } from './types/evaluations';
import { FetchEvaluations } from './update-all';
import * as crossrefDate from '../third-parties/crossref/fetch-all-paper-expressions/date-stamp';
import { expressionDoiCodec } from '../types/expression-doi';

const crossrefResponseCodec = t.strict({
  message: t.strict({
    items: t.readonlyArray(t.strict({
      DOI: t.string,
      published: crossrefDate.codec,
      relation: t.strict({
        'is-review-of': t.tuple([t.strict({
          id: expressionDoiCodec,
        })]),
      }),
    })),
  }),
});

type CrossrefResponse = t.TypeOf<typeof crossrefResponseCodec>;

const toEvaluation = (
  item: CrossrefResponse['message']['items'][number],
): Evaluation => ({
  evaluationLocator: `doi:${item.DOI}`,
  articleDoi: item.relation['is-review-of'][0].id,
  authors: [],
  evaluationType: 'review',
  date: crossrefDate.toDate(item.published),
});

export const fetchReviewsFromAccessMicrobiology: FetchEvaluations = (dependencies) => pipe(
  'https://api.crossref.org/works?filter=prefix:10.1099,type:peer-review,relation.type:is-review-of',
  dependencies.fetchData,
  TE.chainEitherK(flow(
    crossrefResponseCodec.decode,
    E.mapLeft(() => 'acmi: could not decode crossref response'),
  )),
  TE.map((response) => response.message.items),
  TE.map(RA.map(toEvaluation)),
  TE.map((evaluations) => ({
    evaluations: process.env.EXPERIMENT_ENABLED === 'true' ? evaluations : [],
    skippedItems: [],
  })),
);
