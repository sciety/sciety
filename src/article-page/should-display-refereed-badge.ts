import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEvaluationRecordedEvent } from '../domain-events';
import { Doi } from '../types/doi';
import { fromValidatedString } from '../types/group-id';

const screenItId = fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65');

type ShouldDisplayRefereedBadge = (articleId: Doi) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const shouldDisplayRefereedBadge: ShouldDisplayRefereedBadge = (articleId) => (events) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.filter((event) => event.articleId.value === articleId.value),
  RA.some((event) => event.groupId !== screenItId),
);
