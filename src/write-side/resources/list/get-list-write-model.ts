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
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';

type GetListWriteModel = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ListWriteModel>;

type RelevantEvent = ReturnType<typeof filterToEventsRelevantToWriteModel>[number];

const filterToEventsRelevantToWriteModel = filterByName([
  'ListCreated',
  'ExpressionAddedToList',
  'ArticleRemovedFromList',
  'ListNameEdited',
  'ListDescriptionEdited',
  'ExpressionInListAnnotated',
]);

const isAnEventOfThisList = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

const updateListWriteModel = (resource: E.Either<ErrorMessage, ListWriteModel>, event: DomainEvent) => {
  if (isEventOfType('ListCreated')(event)) {
    return E.right({ expressions: [], name: event.name, description: event.description } satisfies ListWriteModel);
  }
  if (isEventOfType('ExpressionAddedToList')(event)) {
    pipe(
      resource,
      E.map((listResource) => {
        listResource.expressions.push({ expressionDoi: event.expressionDoi, annotated: false } satisfies ListWriteModel['expressions'][number]);
        return undefined;
      }),
    );
  }
  if (isEventOfType('ExpressionInListAnnotated')(event)) {
    pipe(
      resource,
      E.map((listResource) => {
        pipe(
          listResource.expressions,
          A.findFirst((expression) => expression.expressionDoi === event.expressionDoi),
          O.map((expression) => {
            // eslint-disable-next-line no-param-reassign
            expression.annotated = true;
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
        listResource.expressions,
        A.filter((expression) => expression.expressionDoi !== event.articleId.value),
        (ids) => ({ ...listResource, expressions: ids } satisfies ListWriteModel),
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

/** @deprecated use more targeted write models for individual scenarios */
export const getListWriteModel: GetListWriteModel = (listId) => (events) => pipe(
  events,
  filterToEventsRelevantToWriteModel,
  RA.filter(isAnEventOfThisList(listId)),
  RA.reduce(E.left(toErrorMessage('list-not-found')), updateListWriteModel),
);
