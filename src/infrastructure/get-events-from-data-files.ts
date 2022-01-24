import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { evaluationEventsFilepathForGroupId, readEventsFile } from './events-file';
import { DomainEvent, evaluationRecorded } from '../domain-events';
import { GroupId } from '../types/group-id';

export const getEventsFromDataFiles = (
  groupIds: ReadonlyArray<GroupId>,
): TE.TaskEither<unknown, ReadonlyArray<DomainEvent>> => pipe(
  groupIds,
  TE.traverseArray((groupId) => pipe(
    groupId,
    evaluationEventsFilepathForGroupId,
    readEventsFile,
    TE.map(RA.map(({
      date, articleDoi, evaluationLocator, authors, publishedAt,
    }) => evaluationRecorded(groupId, articleDoi, evaluationLocator, authors, publishedAt, date))),
  )),
  TE.map(RA.flatten),
);
