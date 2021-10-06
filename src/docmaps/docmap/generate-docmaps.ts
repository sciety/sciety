import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { Docmap, docmap, Ports as DocmapPorts } from './docmap';
import { DomainEvent, isGroupEvaluatedArticleEvent } from '../../domain-events';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import * as GID from '../../types/group-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const ncrcGroupId = GID.fromValidatedString('62f9b0d0-8d43-4766-a52a-ce02af61bc6a');

const isEvaluatedByNcrc = (getAllEvents: GetAllEvents) => (doi: Doi) => pipe(
  getAllEvents,
  T.map(flow(
    RA.filter(isGroupEvaluatedArticleEvent),
    RA.filter(({ groupId }) => ncrcGroupId === groupId),
  )),
  T.map(RA.findFirst(({ articleId }) => articleId.value === doi.value)),
  TO.map(({ articleId }) => articleId),
  TE.fromTaskOption(() => DE.notFound),
);

type Ports = {
  getAllEvents: GetAllEvents,
} & DocmapPorts;

export const generateDocmaps = (
  ports: Ports,
) => (
  input: unknown,
): TE.TaskEither<DE.DataError, Docmap> => pipe(
  input,
  DoiFromString.decode,
  E.mapLeft(() => DE.notFound),
  TE.fromEither,
  TE.chain(isEvaluatedByNcrc(ports.getAllEvents)),
  TE.chain(docmap(ports, ncrcGroupId)),
);
