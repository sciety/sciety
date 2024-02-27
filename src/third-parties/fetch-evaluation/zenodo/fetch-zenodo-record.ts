import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import * as DE from '../../../types/data-error';
import { htmlFragmentCodec } from '../../../types/html-fragment';
import { Evaluation } from '../../../types/evaluation';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { QueryExternalService } from '../../query-external-service';
import { Logger } from '../../../shared-ports';

const isDoiFromZenodo = (doi: string) => doi.startsWith('10.5281/');

const parseZenodoId = (zenodoDoi: string) => pipe(
  zenodoDoi.match(/10\.5281\/zenodo\.([0-9]+)/),
  O.fromNullable,
  O.chain(RA.lookup(1)),
);

const zenodoRecordCodec = t.type({
  metadata: t.type({
    description: htmlFragmentCodec,
  }),
});

type FetchZenodoRecord = (queryExternalService: QueryExternalService, logger: Logger)
=> (key: string)
=> TE.TaskEither<DE.DataError, Evaluation>;

export const fetchZenodoRecord: FetchZenodoRecord = (queryExternalService, logger) => (key) => pipe(
  key,
  E.fromPredicate(
    isDoiFromZenodo,
    () => DE.unavailable,
  ),
  E.chainOptionK(() => DE.unavailable)(parseZenodoId),
  TE.fromEither,
  TE.chain((zenodoId) => pipe(
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
  TE.map((fullText) => ({
    fullText: sanitise(fullText),
    url: new URL(`https://doi.org/${key}`),
  })),
);
