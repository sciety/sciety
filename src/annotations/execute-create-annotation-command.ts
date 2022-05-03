import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { AnnotationCreatedEvent, DomainEvent } from '../domain-events';
import { annotationCreated, isAnnotationCreatedEvent } from '../domain-events/annotation-created-event';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { ListId } from '../types/list-id';

export type CreateAnnotationCommand = {
  content: HtmlFragment,
  target: {
    articleId: Doi,
    listId: ListId,
  },

};

type ExecuteCreateAnnotationCommand = (command: CreateAnnotationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<AnnotationCreatedEvent>;

export const executeCreateAnnotationCommand: ExecuteCreateAnnotationCommand = (command) => (events) => pipe(
  events,
  RA.filter(isAnnotationCreatedEvent),
  RA.filter((event) => (
    event.target.articleId.value === command.target.articleId.value
     && event.target.listId === command.target.listId
  )),
  RA.match(
    () => [annotationCreated(command.target, command.content)],
    () => [],
  ),
);
