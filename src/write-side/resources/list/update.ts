import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { ListWriteModel } from './list-write-model';
import {
  constructEvent,
  isEventOfType,
  DomainEvent,
  filterByName,
} from '../../../domain-events';
import { eqArticleId } from '../../../types/article-id';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';
import { EditListDetailsCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const filterToRelevantEventTypes = filterByName(['ListCreated', 'ArticleAddedToList', 'ArticleRemovedFromList', 'ListNameEdited', 'ListDescriptionEdited', 'ArticleInListAnnotated']);

type RelevantEvent = ReturnType<typeof filterToRelevantEventTypes>[number];

const isAnEventOfThisList = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

const updateListWriteModel = (resource: E.Either<ErrorMessage, ListWriteModel>, event: DomainEvent) => {
  if (isEventOfType('ListCreated')(event)) {
    return E.right({ articles: [], name: event.name, description: event.description } satisfies ListWriteModel);
  }
  if (isEventOfType('ArticleAddedToList')(event)) {
    pipe(
      resource,
      E.map((listResource) => {
        listResource.articles.push({ articleId: event.articleId, annotated: false } satisfies ListWriteModel['articles'][number]);
        return undefined;
      }),
    );
  }
  if (isEventOfType('ArticleInListAnnotated')(event)) {
    pipe(
      resource,
      E.map((listResource) => {
        pipe(
          listResource.articles,
          A.findFirst((article) => eqArticleId.equals(article.articleId, event.articleId)),
          O.map((article) => {
            // eslint-disable-next-line no-param-reassign
            article.annotated = true;
            return undefined;
          }),
        );
        return undefined;
      }),
    );
  }
  if (isEventOfType('ArticleRemovedFromList')(event)) {
    return pipe(
      resource,
      E.map((listResource) => pipe(
        listResource.articles,
        A.filter((article) => !eqArticleId.equals(article.articleId, event.articleId)),
        (ids) => ({ ...listResource, articles: ids } satisfies ListWriteModel),
      )),
    );
  }
  if (isEventOfType('ListNameEdited')(event)) {
    return pipe(
      resource,
      E.map((listResource) => ({ ...listResource, name: event.name } satisfies ListWriteModel)),
    );
  }
  if (isEventOfType('ListDescriptionEdited')(event)) {
    return pipe(
      resource,
      E.map((listResource) => ({ ...listResource, description: event.description } satisfies ListWriteModel)),
    );
  }
  return resource;
};
const handleEditingOfName = (listResource: ListWriteModel, command: EditListDetailsCommand) => (
  (listResource.name === command.name)
    ? []
    : [constructEvent('ListNameEdited')({ listId: command.listId, name: command.name })]
);

const handleEditingOfDescription = (listResource: ListWriteModel, command: EditListDetailsCommand) => (
  (listResource.description === command.description)
    ? []
    : [constructEvent('ListDescriptionEdited')({ listId: command.listId, description: command.description })]
);

export const update: ResourceAction<EditListDetailsCommand> = (command) => (events) => pipe(
  events,
  E.right,
  E.filterOrElse(
    doesListExist(command.listId),
    () => toErrorMessage('list-not-found'),
  ),
  E.map(filterToRelevantEventTypes),
  E.map(RA.filter(isAnEventOfThisList(command.listId))),
  E.chain(RA.reduce(E.left(toErrorMessage('list-not-found')), updateListWriteModel)),
  E.map((listResource) => [
    ...handleEditingOfName(listResource, command),
    ...handleEditingOfDescription(listResource, command),
  ]),
);
