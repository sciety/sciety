import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Params } from './filter-by';
import { DomainEvent } from '../../domain-events';
import * as Doi from '../../types/doi';
import * as GID from '../../types/group-id';
import { allDocmapDois } from '../all-docmap-dois';

type DocmapIndex = {
  articles: ReadonlyArray<{ doi: string, docmap: string }>,
};

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

const filterByGroup = (group: O.Option<GID.GroupId>) => (dois: ReadonlyArray<Doi.Doi>) => pipe(
  group,
  O.fold(
    () => [...dois, new Doi.Doi('10.1101/2021.04.25.441302')],
    (gid) => {
      switch (gid) {
        case ncrcGroupId:
          return dois;
        default:
          return [new Doi.Doi('10.1101/2021.04.25.441302')];
      }
    },
  ),
);

export const generateDocmapIndex = (ports: Ports) => (params: Params): T.Task<DocmapIndex> => pipe(
  ports.getAllEvents,
  T.map(flow(
    allDocmapDois(ncrcGroupId),
    filterByGroup(params.group),
    RA.map((doi) => ({
      doi: doi.value,
      docmap: `https://sciety.org/docmaps/v1/articles/${doi.value}.docmap.json`,
    })),
    (articles) => ({
      articles,
    }),
  )),
);
