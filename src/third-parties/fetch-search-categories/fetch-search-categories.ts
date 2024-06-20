import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';
import { decodeAndLogFailures } from '../decode-and-log-failures';
import { ExternalQueries } from '../external-queries';

const hardCodedResponse = {
  data: [
    {
      type: 'category',
      id: 'Infectious Diseases (except HIV/AIDS)',
    },
    {
      type: 'category',
      id: 'Epidemiology',
    },
  ],
};

const scietyLabsCategoriesResponseCodec = t.type({
  data: t.array(t.type({
    type: t.literal('category'),
    id: t.string,
  })),
});

const url = 'https://labs.sciety.org/api/papers/v1/preprints/classifications?filter%5Bevaluated_only%5D=true';

export const fetchSearchCategories = (logger: Logger): ExternalQueries['fetchSearchCategories'] => () => pipe(
  hardCodedResponse,
  TE.right,
  TE.chainEitherKW(flow(
    decodeAndLogFailures(logger, scietyLabsCategoriesResponseCodec, { url }),
    E.mapLeft(() => DE.unavailable),
  )),
  TE.map((response) => response.data),
  TE.map(RA.map((category) => category.id)),
);
