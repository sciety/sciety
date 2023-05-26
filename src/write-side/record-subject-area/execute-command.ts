import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../commands';
import { DomainEvent, isEventOfType } from '../../domain-events/domain-event';
import { subjectAreaRecorded } from '../../domain-events/subject-area-recorded-event';
import { Doi, eqDoi } from '../../types/doi';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';

const buildUpArticleSubjectAreaResourceFor = (articleId: Doi) => flow(
  RA.filter(isEventOfType('SubjectAreaRecorded')),
  RA.filter((event) => eqDoi.equals(event.articleId, articleId)),
  RA.head,
  O.map((event) => event.subjectArea),
);

type ExecuteCommand = (command: RecordSubjectAreaCommand)
=> (events: ReadonlyArray<DomainEvent>) => E.Either<ErrorMessage, ReadonlyArray<DomainEvent>> ;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  buildUpArticleSubjectAreaResourceFor(command.articleId),
  O.match(
    () => E.right([subjectAreaRecorded(command.articleId, command.subjectArea)]),
    (subjectArea) => (subjectArea === command.subjectArea
      ? E.right([])
      : E.left(toErrorMessage('changing of subject area not possible according to domain model'))),
  ),
);
