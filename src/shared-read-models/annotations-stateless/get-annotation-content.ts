import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { isAnnotationCreatedEvent } from '../../domain-events/annotation-created-event';
import { Doi } from '../../types/doi';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';

type GetAnnotationContent = (listId: ListId, articleId: Doi)
=> (events: ReadonlyArray<DomainEvent>)
=> O.Option<HtmlFragment>;

export const getAnnotationContent: GetAnnotationContent = (listId, articleId) => (events) => pipe(
  events,
  RA.filter(isAnnotationCreatedEvent),
  RA.filter((event) => (event.target.articleId === articleId && event.target.listId === listId)),
  RA.head,
  O.map((event) => toHtmlFragment(event.content)),
);
