import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListWriteModel } from './list-write-model';
import {
  isEventOfType,
  DomainEvent,
  filterByName,
} from '../../../domain-events';
import { eqArticleId } from '../../../types/article-id';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';

type GetListWriteModel = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ListWriteModel>;

type RelevantEvent = ReturnType<typeof filterToEventsRelevantToWriteModel>[number];

const filterToEventsRelevantToWriteModel = filterByName(['ListCreated', 'ArticleAddedToList', 'ArticleRemovedFromList', 'ListNameEdited', 'ListDescriptionEdited', 'ArticleInListAnnotated']);

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

export const getListWriteModel: GetListWriteModel = (listId) => (events) => pipe(
  events,
  filterToEventsRelevantToWriteModel,
  RA.filter(isAnEventOfThisList(listId)),
  RA.reduce(E.left(toErrorMessage(`List with list id ${listId} not found`)), updateListWriteModel),
);
