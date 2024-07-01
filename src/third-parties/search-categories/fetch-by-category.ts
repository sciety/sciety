import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import * as EDOI from '../../types/expression-doi';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';
import { QueryExternalService } from '../query-external-service';

const buildUrl = (categoryName: string) => `https://labs.sciety.org/api/papers/v1/preprints?filter%5Bcategory%5D=${categoryName}&filter%5Bevaluated_only%5D=true&page%5Bsize%5D=10&page%5Bnumber%5D=1&fields%5Bpaper%5D=doi`;

const scietyLabsByCategoryResponseCodec = t.type({
  data: t.readonlyArray(t.strict({
    attributes: t.strict({
      doi: t.string,
    }),
  })),
});

export const fetchByCategory = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): ExternalQueries['fetchByCategory'] => () => pipe(
  'Epidemiology',
  buildUrl,
  queryExternalService(),
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, scietyLabsByCategoryResponseCodec, { url: buildUrl }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((result) => result.data),
  TE.map(RA.map((item) => item.attributes.doi)),
  TE.map(RA.map(EDOI.canonicalExpressionDoiCodec.decode)),
  TE.map(RA.separate),
  TE.map((separated) => separated.right),
);
