import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { allDocmapDois } from './all-docmap-dois';
import { DomainEvent } from '../domain-events';
import * as Doi from '../types/doi';
import * as GID from '../types/group-id';

type DocmapIndex = {
  articles: ReadonlyArray<{ doi: string, docmap: string }>,
};

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const paramsCodec = t.type({
  updatedAfter: tt.optionFromNullable(tt.DateFromISOString),
});

type Params = t.TypeOf<typeof paramsCodec>;

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

export const generateDocmapIndex = (ports: Ports) => (params: Params): T.Task<DocmapIndex> => pipe(
  ports.getAllEvents,
  T.map(flow(
    allDocmapDois(ncrcGroupId),
    (docmapDois) => pipe(
      params.updatedAfter,
      O.fold(
        () => docmapDois,
        () => docmapDois,
      ),
    ),
    (dois) => [...dois, new Doi.Doi('10.1101/2021.04.25.441302')],
    RA.map((doi) => ({
      doi: doi.value,
      docmap: `https://sciety.org/docmaps/v1/articles/${doi.value}.docmap.json`,
    })),
    (articles) => ({
      articles,
    }),
  )),
);
