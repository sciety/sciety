import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { getListWriteModel } from './get-list-write-model';
import { ListWriteModel } from './list-write-model';
import { constructEvent } from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { ListId } from '../../../types/list-id';
import { RemoveArticleFromListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

type Command = {
  articleId: ArticleId,
  listId: ListId,
};

const createAppropriateEvents = (command: Command) => (listResource: ListWriteModel) => pipe(
  listResource.articles,
  RA.some((article) => article.articleId.value === command.articleId.value),
  B.fold(
    () => [],
    () => [constructEvent('ArticleRemovedFromList')(command)],
  ),
);

export const removeArticle: ResourceAction<RemoveArticleFromListCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.map(createAppropriateEvents(command)),
);
