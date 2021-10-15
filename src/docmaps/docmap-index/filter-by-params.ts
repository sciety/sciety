import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Errors } from 'io-ts';
import * as tt from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { DocmapIndexEntryModel } from './identify-all-possible-index-entries';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import * as GID from '../../types/group-id';

type ErrorResponse = {
  body: { error: string },
  status: StatusCodes,
};

type FilterByParams = (
  query: Record<string, unknown>
) => (entries: ReadonlyArray<DocmapIndexEntryModel>) => E.Either<ErrorResponse, ReadonlyArray<DocmapIndexEntryModel>>;

const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
  group: tt.optionFromNullable(GroupIdFromString),
});

const toBadRequestResponse = (errors: Errors) => ({
  body: { error: PR.failure(errors).join('\n') },
  status: StatusCodes.BAD_REQUEST,
});

const filterByGroup = (
  requestedGroupId: O.Option<GID.GroupId>,
) => (indexEntries: ReadonlyArray<DocmapIndexEntryModel>) => pipe(
  requestedGroupId,
  O.fold(
    () => indexEntries,
    (groupId) => pipe(
      indexEntries,
      RA.filter((indexEntry) => indexEntry.groupId === groupId),
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
    toBadRequestResponse,
    ({ group, updatedAfter }) => pipe(
      entries,
      filterByUpdatedAfter(updatedAfter),
      filterByGroup(group),
    ),
  ),
);
