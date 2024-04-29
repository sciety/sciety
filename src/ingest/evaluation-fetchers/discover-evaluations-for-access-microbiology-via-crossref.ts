import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { expressionDoiCodec } from '../../types/expression-doi';
import { PublishedEvaluation, constructPublishedEvaluation } from '../types/published-evaluation';
import { DiscoverPublishedEvaluations } from '../update-all';

const publishedDateCodec = t.strict({
  'date-parts': t.tuple([
    t.tuple([t.number, t.number, t.number]),
  ]),
});

type PublishedDate = t.TypeOf<typeof publishedDateCodec>;

const toEvaluationDate = (date: PublishedDate): Date => {
  const dateParts = date['date-parts'][0];
  return new Date(
    dateParts[0],
    dateParts[1] - 1,
    dateParts[2],
  );
};

const crossrefResponseCodec = t.strict({
  message: t.strict({
    items: t.readonlyArray(t.strict({
      DOI: t.string,
      published: publishedDateCodec,
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
): PublishedEvaluation => constructPublishedEvaluation({
  evaluationLocator: `doi:${item.DOI}`,
  paperExpressionDoi: item.relation['is-review-of'][0].id,
  evaluationType: 'review',
  publishedOn: toEvaluationDate(item.published),
});

const toHumanFriendlyErrorMessage = (
  errors: t.Errors,
) => pipe(
  errors,
  formatValidationErrors,
  (formattedErrors) => `acmi: could not decode crossref response ${formattedErrors.join(', ')}`,
);

export const discoverEvaluationsForAccessMicrobiologyViaCrossref: DiscoverPublishedEvaluations = (dependencies) => pipe(
  'https://api.crossref.org/works?filter=prefix:10.1099,type:peer-review,relation.type:is-review-of&sort=published&order=asc',
  dependencies.fetchData,
  TE.chainEitherK(flow(
    crossrefResponseCodec.decode,
    E.mapLeft(toHumanFriendlyErrorMessage),
  )),
  TE.map((response) => response.message.items),
  TE.map(RA.map(toEvaluation)),
  TE.map((evaluations) => ({
    understood: process.env.EXPERIMENT_ENABLED === 'true' ? evaluations : [],
    skipped: [],
  })),
);
