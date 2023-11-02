import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { toHtmlFragment } from '../../../types/html-fragment';
import { constructEvent } from '../../../domain-events';
import { AnnotateArticleInListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { replayListResource } from './replay-list-resource';
import { ListResource } from './list-resource';

const createAppropriateEvents = (command: AnnotateArticleInListCommand) => (listResource: ListResource) => pipe(
  listResource.articles,
  RA.filter((article) => article.articleId.value === command.articleId.value),
  RA.filter((article) => article.annotated),
  RA.match(
    () => [constructEvent('ArticleInListAnnotated')({ articleId: command.articleId, listId: command.listId, content: toHtmlFragment(command.content) })],
    () => [],
  ),
);

export const annotate: ResourceAction<AnnotateArticleInListCommand> = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(createAppropriateEvents(command)),
);
