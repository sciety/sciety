import * as RA from 'fp-ts/ReadonlyArray';
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

type RaiseEventsIfNecessary = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<RuntimeGeneratedEvent>;

export const raiseEventsIfNecessary: RaiseEventsIfNecessary = (command) => (events) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.match(
    () => [evaluationRecorded(
      command.groupId,
      command.articleId,
      command.evaluationLocator,
      new Date(),
      command.authors,
      command.publishedAt,
    )],
    () => [],
  ),
);
