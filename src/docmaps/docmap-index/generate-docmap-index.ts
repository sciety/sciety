import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { DomainEvent } from '../../domain-events';
import { GroupIdFromString } from '../../types/codecs/GroupIdFromString';
import * as Doi from '../../types/doi';
import * as GID from '../../types/group-id';
import { GroupId } from '../../types/group-id';
import { allDocmapDois } from '../all-docmap-dois';

export const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
  group: tt.optionFromNullable(GroupIdFromString),
});

type Params = t.TypeOf<typeof paramsCodec>;

type DocmapIndex = {
  articles: ReadonlyArray<{ doi: string, docmap: string }>,
};

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

const filterByGroup = (
  selectedGroup: O.Option<GID.GroupId>,
) => (docmaps: ReadonlyArray<{ doi: Doi.Doi, groupId: GroupId }>) => pipe(
  selectedGroup,
  O.fold(
    () => docmaps,
    (groupId) => pipe(
      docmaps,
      RA.filter((docmap) => docmap.groupId === groupId),
    ),
  ),
);

export const generateDocmapIndex = (ports: Ports) => (params: Params): T.Task<DocmapIndex> => pipe(
  ports.getAllEvents,
  T.map(flow(
    allDocmapDois(ncrcGroupId),
    RA.map((doi) => ({ doi, groupId: ncrcGroupId })),
    filterByGroup(params.group),
    RA.map(({ doi }) => ({
      doi: doi.value,
      docmap: `https://sciety.org/docmaps/v1/articles/${doi.value}.docmap.json`,
    })),
    (articles) => ({
      articles,
    }),
  )),
);
