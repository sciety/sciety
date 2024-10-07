import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import * as EDOI from '../../types/expression-doi';
import { QueryParameters } from '../../types/query-parameters';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

const buildUrl = (queryParameters: QueryParameters) => {
  const queryUrl = new URL('https://labs.sciety.org/api/papers/v1/preprints');
  queryUrl.searchParams.set('filter[category]', queryParameters.category);
  queryUrl.searchParams.set('filter[evaluated_only]', 'true');
  queryUrl.searchParams.set('page[size]', '10');
  queryUrl.searchParams.set('page[number]', queryParameters.pageNumber.toString());
  queryUrl.searchParams.set('fields[paper]', 'doi');
  return queryUrl.href;
};

const scietyLabsByCategoryResponseCodec = t.type({
  data: t.readonlyArray(t.strict({
    attributes: t.strict({
      doi: t.string,
    }),
  })),
  meta: t.strict({
    total: t.number,
  }),
});

type ScietyLabsByCategoryResponse = t.TypeOf<typeof scietyLabsByCategoryResponseCodec>;

const toExpressionDois = (result: ScietyLabsByCategoryResponse) => pipe(
  result.data,
  RA.map((item) => item.attributes.doi),
  RA.map(EDOI.canonicalExpressionDoiCodec.decode),
  RA.separate,
  (separated) => separated.right,
);

export const fetchByCategory = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchByCategory'] => (queryParameters) => pipe(
  queryParameters,
  buildUrl,
  queryExternalService(),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, scietyLabsByCategoryResponseCodec, { url: buildUrl }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((result) => ({
    expressionDois: toExpressionDois(result),
    totalItems: result.meta.total,
  })),
);
