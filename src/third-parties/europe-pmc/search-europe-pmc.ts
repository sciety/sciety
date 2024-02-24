import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import * as DE from '../../types/data-error';
import { Logger } from '../../infrastructure';
import { constructQueryUrl } from './construct-query-url';
import { QueryExternalService } from '../query-external-service';
import { ExternalQueries } from '../external-queries';
import { expressionDoiCodec } from '../../types/expression-doi';

const itemFromJson = t.type({
  doi: expressionDoiCodec,
});

const europePmcResponse = t.type({
  hitCount: t.number,
  nextCursorMark: tt.optionFromNullable(t.string),
  resultList: t.type({
    result: t.array(itemFromJson),
  }),
});

type EuropePmcResponse = t.TypeOf<typeof europePmcResponse>;

const constructSearchResults = (pageSize: number) => (data: EuropePmcResponse) => {
  const items = data.resultList.result.map((item) => item.doi);
  const nextCursor = data.resultList.result.length < pageSize ? O.none : data.nextCursorMark;
  return {
    items,
    total: data.hitCount,
    nextCursor,
  };
};

const getFromUrl = (queryExternalService: QueryExternalService, logger: Logger) => (url: string) => pipe(
  url,
  queryExternalService('error'),
  TE.chainEitherKW(flow(
    europePmcResponse.decode,
    E.mapLeft((errors) => {
      logger(
        'error',
        'Could not parse response from Europe PMC',
        { errors: PR.failure(errors), url },
      );
      return DE.unavailable;
    }),
  )),
);

export const searchEuropePmc = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['searchForPaperExpressions'] => (pageSize) => (
  query,
  cursor,
  evaluatedOnly,
) => pipe(
  constructQueryUrl(query, cursor, evaluatedOnly, pageSize),
  getFromUrl(queryExternalService, logger),
  TE.map(constructSearchResults(pageSize)),
);
