import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { getListWriteModel } from './get-list-write-model';
import { ListWriteModel } from './list-write-model';
import { constructEvent } from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { RemoveArticleFromListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const createAppropriateEvents = (command: RemoveArticleFromListCommand) => (listResource: ListWriteModel) => pipe(
  listResource.articles,
  RA.some((article) => article.articleId.value === command.articleId),
  B.fold(
    () => [],
    () => [constructEvent('ArticleRemovedFromList')({
      articleId: new ArticleId(command.articleId),
      listId: command.listId,
    })],
  ),
);

export const removeArticle: ResourceAction<RemoveArticleFromListCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.map(createAppropriateEvents(command)),
);
