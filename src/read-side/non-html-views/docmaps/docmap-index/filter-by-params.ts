import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import * as ER from './error-response';
import { DocmapIndexEntryModel } from './identify-all-possible-index-entries';
import { Params, paramsCodec } from './params';

const filterByPublisherAccount = (
  requestedPublisherAccountId: O.Option<string>,
) => (indexEntries: ReadonlyArray<DocmapIndexEntryModel>) => pipe(
  requestedPublisherAccountId,
  O.match(
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
  O.match(
    () => docmaps,
    (updated) => pipe(
      docmaps,
      RA.filter((docmap) => docmap.updated > updated),
    ),
  ),
);

export const decodeParams = (query: unknown): E.Either<ER.ErrorResponse, Params> => pipe(
  query,
  paramsCodec.decode,
  E.mapLeft(
    (errors) => pipe(
      PR.failure(errors).join('\n'),
      ER.badRequest,
    ),
  ),
);

type FilterByParams = (
  params: Params,
) => (
  entries: ReadonlyArray<DocmapIndexEntryModel>
) => E.Either<ER.ErrorResponse, ReadonlyArray<DocmapIndexEntryModel>>;

export const filterByParams: FilterByParams = (params) => (entries) => pipe(
  entries,
  filterByUpdatedAfter(params.updatedAfter),
  filterByPublisherAccount(params.publisheraccount),
  E.right,
);
