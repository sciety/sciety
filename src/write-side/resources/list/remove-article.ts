import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { RemoveArticleFromListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const removeArticle: ResourceAction<RemoveArticleFromListCommand> = (command) => () => pipe(
  [constructEvent('ArticleRemovedFromList')(({
    articleId: new ArticleId(command.articleId),
    listId: command.listId,
  }))],
  E.right,
);
