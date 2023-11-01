import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { toHtmlFragment } from '../../../types/html-fragment';
import { eqAnnotationTarget } from '../../../types/annotation-target';
import { isEventOfType, constructEvent } from '../../../domain-events';
import { AnnotateArticleInListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const annotate: ResourceAction<AnnotateArticleInListCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isEventOfType('ArticleInListAnnotated')),
  RA.filter((event) => eqAnnotationTarget.equals(
    {
      articleId: event.articleId,
      listId: event.listId,
    },
    {
      articleId: command.articleId,
      listId: command.listId,
    },
  )),
  RA.match(
    () => [constructEvent('ArticleInListAnnotated')({ articleId: command.articleId, listId: command.listId, content: toHtmlFragment(command.content) })],
    () => [],
  ),
  E.right,
);
