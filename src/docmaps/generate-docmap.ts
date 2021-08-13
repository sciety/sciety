import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { allDocmapDois } from './all-docmap-dois';
import { docmap, Ports as DocmapPorts } from './docmap';
import { DomainEvent } from '../domain-events';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as DE from '../types/data-error';
import * as GID from '../types/group-id';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
} & DocmapPorts;

export const generateDocmap = (
  ports: Ports,
) => (
  input: unknown,
): TE.TaskEither<DE.DataError, Record<string, unknown>> => {
  const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');
  return pipe(
    {
      doi: pipe(
        input,
        DoiFromString.decode,
        E.mapLeft(() => DE.notFound),
        TE.fromEither,
      ),
      indexedDois: pipe(
        ports.getAllEvents,
        T.map(allDocmapDois(ncrcGroupId)),
        TE.rightTask,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.chain(({ doi, indexedDois }) => docmap(ports)(doi, indexedDois, ncrcGroupId)),
  );
};
