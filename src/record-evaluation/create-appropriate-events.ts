import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, evaluationRecorded, isEvaluationRecordedEvent, RuntimeGeneratedEvent,
} from '../domain-events';
import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type Command = {
  groupId: GroupId,
  evaluationLocator: ReviewId,
  articleId: Doi,
  authors: ReadonlyArray<string>,
  publishedAt: Date,
};

type CreateAppropriateEvents = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<RuntimeGeneratedEvent>;

const hasEvaluationAlreadyBeenRecorded = (evaluationLocator: ReviewId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.some((event) => event.evaluationLocator === evaluationLocator),
);

const createEvaluationRecordedEvent = (command: Command) => evaluationRecorded(
  command.groupId,
  command.articleId,
  command.evaluationLocator,
  command.authors,
  command.publishedAt,
  new Date(),
);

export const createAppropriateEvents: CreateAppropriateEvents = (command) => (events) => pipe(
  events,
  hasEvaluationAlreadyBeenRecorded(command.evaluationLocator),
  B.fold(
    () => [createEvaluationRecordedEvent(command)],
    () => [],
  ),
);
