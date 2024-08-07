import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { getListWriteModel } from './get-list-write-model';
import { isAnnotationLengthValid } from './is-annotation-length-valid';
import { ListWriteModel } from './list-write-model';
import { constructEvent } from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { toErrorMessage } from '../../../types/error-message';
import { AddArticleToListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const constructEvents = (command: AddArticleToListCommand) => (
  command.annotation === undefined
    ? [
      constructEvent('ArticleAddedToList')({
        articleId: new ArticleId(command.expressionDoi),
        listId: command.listId,
      }),
    ]
    : [
      constructEvent('ArticleAddedToList')({
        articleId: new ArticleId(command.expressionDoi),
        listId: command.listId,
      }),
      constructEvent('ArticleInListAnnotated')({
        articleId: new ArticleId(command.expressionDoi),
        listId: command.listId,
        content: command.annotation,
      }),
    ]
);

const createAppropriateEvents = (command: AddArticleToListCommand) => (listResource: ListWriteModel) => pipe(
  listResource.articles,
  RA.some((article) => article.articleId.value === command.expressionDoi),
  B.fold(
    () => constructEvents(command),
    () => [],
  ),
);

const isAnnotationValidIfPresent = (command: AddArticleToListCommand) => () => {
  if (command.annotation !== undefined) {
    return isAnnotationLengthValid(command.annotation);
  }
  return true;
};

export const addArticle: ResourceAction<AddArticleToListCommand> = (command) => (events) => pipe(
  events,
  E.right,
  E.filterOrElse(
    doesListExist(command.listId),
    () => toErrorMessage(`List with list id ${command.listId} not found`),
  ),
  E.chain(getListWriteModel(command.listId)),
  E.filterOrElseW(
    isAnnotationValidIfPresent(command),
    () => toErrorMessage('Annotation too long'),
  ),
  E.map(createAppropriateEvents(command)),
);
