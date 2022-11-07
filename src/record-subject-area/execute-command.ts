import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../commands';
import { DomainEvent } from '../domain-events/domain-event';
import { isSubjectAreaRecordedEvent, subjectAreaRecorded } from '../domain-events/subject-area-recorded-event';
import { eqDoi } from '../types/doi';

type ExecuteCommand = (command: RecordSubjectAreaCommand)
=> (events: ReadonlyArray<DomainEvent>) => E.Either<string, ReadonlyArray<DomainEvent>> ;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  RA.filter(isSubjectAreaRecordedEvent),
  RA.filter((event) => eqDoi.equals(event.articleId, command.articleId)),
  RA.head,
  E.fromOption(() => 'no subject area recorded for this article'),
  E.match(
    () => E.right([subjectAreaRecorded(command.articleId, command.subjectArea)]),
    (event) => (event.subjectArea === command.subjectArea
      ? E.right([])
      : E.left('changing of subject area not possible according to domain model')),
  ),
);
