import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { docmap, Ports as DocmapPorts } from './docmap';
import { DomainEvent } from '../../domain-events';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import * as GID from '../../types/group-id';
import { GroupId } from '../../types/group-id';
import { allDocmapDois } from '../all-docmap-dois';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isInIndex = (getAllEvents: GetAllEvents, indexedGroupId: GroupId) => (doi: Doi) => pipe(
  getAllEvents,
  T.map(allDocmapDois(indexedGroupId)),
  T.map(RA.findFirst((indexedDoi) => indexedDoi.value === doi.value)),
  TE.fromTaskOption(() => DE.notFound),
);

type Ports = {
  getAllEvents: GetAllEvents,
} & DocmapPorts;

export const generateDocmap = (
  ports: Ports,
) => (
  input: unknown,
): TE.TaskEither<DE.DataError, Record<string, unknown>> => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  return pipe(
    input,
    DoiFromString.decode,
    E.mapLeft(() => DE.notFound),
    TE.fromEither,
    TE.chain(isInIndex(ports.getAllEvents, ncrcGroupId)),
    TE.chain(docmap(ports, ncrcGroupId)),
  );
};
