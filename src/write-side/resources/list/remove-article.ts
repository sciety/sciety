import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events';
import { ListWriteModel } from './list-write-model';
import { ArticleId } from '../../../types/article-id';
import { ListId } from '../../../types/list-id';
import { replayListResource } from './replay-list-resource';
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
  replayListResource(command.listId),
  E.map(createAppropriateEvents(command)),
);
