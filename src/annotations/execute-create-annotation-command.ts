import { AnnotationCreatedEvent, DomainEvent } from '../domain-events';
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
=> AnnotationCreatedEvent | void;

export const executeCreateAnnotationCommand: ExecuteCreateAnnotationCommand = () => () => {};
