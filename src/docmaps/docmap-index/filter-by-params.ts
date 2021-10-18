import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import * as ER from './error-response';
import { DocmapIndexEntryModel } from './identify-all-possible-index-entries';

type FilterByParams = (
  query: Record<string, unknown>
) => (
  entries: ReadonlyArray<DocmapIndexEntryModel>
) => E.Either<ER.ErrorResponse, ReadonlyArray<DocmapIndexEntryModel>>;

const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
  publisheraccount: tt.optionFromNullable(t.string),
});

const filterByPublisherAccount = (
  requestedPublisherAccountId: O.Option<string>,
) => (indexEntries: ReadonlyArray<DocmapIndexEntryModel>) => pipe(
  requestedPublisherAccountId,
  O.fold(
    () => indexEntries,
    (publisherAccountId) => pipe(
      indexEntries,
      RA.filter((indexEntry) => indexEntry.publisherAccountId === publisherAccountId),
    ),
  ),
);

const filterByUpdatedAfter = (
  updatedAfter: O.Option<Date>,
) => (docmaps: ReadonlyArray<DocmapIndexEntryModel>) => pipe(
  updatedAfter,
  O.fold(
    () => docmaps,
    (updated) => pipe(
      docmaps,
      RA.filter((docmap) => docmap.updated > updated),
    ),
  ),
);

export const filterByParams: FilterByParams = (query) => (entries) => pipe(
  query,
  paramsCodec.decode,
  E.bimap(
    (errors) => pipe(
      PR.failure(errors).join('\n'),
      ER.badRequest,
    ),
    ({ publisheraccount, updatedAfter }) => pipe(
      entries,
      filterByUpdatedAfter(updatedAfter),
      filterByPublisherAccount(publisheraccount),
    ),
  ),
);
