import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

const scietyLabsCategoriesResponseCodec = t.type({
  data: t.array(t.type({
    type: t.literal('category'),
    id: t.string,
  })),
});

const url = 'https://labs.sciety.org/api/papers/v1/preprints/classifications?filter%5Bevaluated_only%5D=true';

export const fetchSearchCategories = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchSearchCategories'] => () => pipe(
  url,
  queryExternalService(),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, scietyLabsCategoriesResponseCodec, { url }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((response) => response.data),
  TE.map(RA.map((category) => category.id)),
);
