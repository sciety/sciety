import { URL } from 'url';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { paramsCodec as docmapIndexParamsCodec, generateDocmapDois } from './generate-docmap-dois';
import { DomainEvent } from '../../domain-events';
import * as GID from '../../types/group-id';
import { docmap, Ports as DocmapPorts } from '../docmap/docmap';

type Ports = DocmapPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

type DocmapIndex = (ports: Ports) => (query: unknown) => T.Task<unknown>;

export const docmapIndex: DocmapIndex = (ports) => flow(
  docmapIndexParamsCodec.decode,
  TE.fromEither,
  TE.chainW(generateDocmapDois(ports)),
  TE.chainW(TE.traverseArray(docmap({
    ...ports,
    fetchReview: () => TE.right({
      url: new URL(`https://example.com/source-url-of-evaluation-${Math.random()}`),
    }),
  }, ncrcGroupId))),
  TE.fold(
    () => T.of({
      articles: [],
    }),
    (foo) => T.of({ articles: foo }),
  ),
);
