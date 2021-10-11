import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DocmapIndexEntryModel, docmapIndexEntryModels } from './docmap-index-entry-models';
import { DomainEvent } from '../../domain-events';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import * as GID from '../../types/group-id';

export const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
  group: tt.optionFromNullable(GroupIdFromString),
});

type Params = t.TypeOf<typeof paramsCodec>;

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const filterByGroup = (
  selectedGroup: O.Option<GID.GroupId>,
) => (docmaps: ReadonlyArray<DocmapIndexEntryModel>) => pipe(
  selectedGroup,
  O.fold(
    () => docmaps,
    (groupId) => pipe(
      docmaps,
      RA.filter((docmap) => docmap.groupId === groupId),
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

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
const rapidReviewsGroupId = GID.fromValidatedString('5142a5bc-6b18-42b1-9a8d-7342d7d17e94');

const supportedGroups = [ncrcGroupId, rapidReviewsGroupId];

export const generateDocmapDois = (
  ports: Ports,
) => (params: Params): TE.TaskEither<never, ReadonlyArray<DocmapIndexEntryModel>> => pipe(
  ports.getAllEvents,
  T.map(flow(
    docmapIndexEntryModels(supportedGroups),
    filterByGroup(params.group),
    filterByUpdatedAfter(params.updatedAfter),
    E.right,
  )),
);
