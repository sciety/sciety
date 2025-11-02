import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { htmlFragmentCodec } from '../../../types/html-fragment';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { QueryExternalService } from '../../query-external-service';
import { EvaluationDigestFetcher } from '../evaluation-digest-fetcher';

const isDoiFromZenodo = (doi: string) => doi.startsWith('10.5281/');

const parseZenodoId = (zenodoDoi: string) => pipe(
  zenodoDoi.match(/10\.5281\/zenodo\.([0-9]+)/),
  O.fromNullable,
  O.flatMap(RA.lookup(1)),
);

const zenodoRecordCodec = t.type({
  metadata: t.type({
    description: htmlFragmentCodec,
  }),
});

export const fetchZenodoRecord = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (key) => pipe(
  key,
  E.fromPredicate(
    isDoiFromZenodo,
    () => DE.unavailable,
  ),
  E.chainOptionK(() => DE.unavailable)(parseZenodoId),
  TE.fromEither,
  TE.flatMap((zenodoId) => pipe(
    `https://zenodo.org/api/records/${zenodoId}`,
    queryExternalService(),
  )),
  TE.chainEitherKW(flow(
    zenodoRecordCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => {
      logger('error', 'Invalid response from Zenodo', { key, errors });
      return DE.unavailable;
    }),
  )),
  TE.map((data) => data.metadata.description),
  TE.map(sanitise),
);
