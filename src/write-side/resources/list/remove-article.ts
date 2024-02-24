import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events/index.js';
import { ListWriteModel } from './list-write-model.js';
import { ArticleId } from '../../../types/article-id.js';
import { ListId } from '../../../types/list-id.js';
import { getListWriteModel } from './get-list-write-model.js';
import { RemoveArticleFromListCommand } from '../../commands/index.js';
import { ResourceAction } from '../resource-action.js';

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
