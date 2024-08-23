import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import { getListWriteModel } from './get-list-write-model';
import { isAnnotationLengthValid } from './is-annotation-length-valid';
import { ListWriteModel } from './list-write-model';
import { constructEvent } from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { toErrorMessage } from '../../../types/error-message';
import * as EDOI from '../../../types/expression-doi';
import { AnnotateArticleInListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const createAppropriateEvents = (command: AnnotateArticleInListCommand) => (article: ListWriteModel['expressions'][number]) => (
  article.annotated
    ? []
    : [constructEvent('ExpressionInListAnnotated')({
      expressionDoi: EDOI.fromValidatedString(command.expressionDoi.value),
      listId: command.listId,
      content: command.annotationContent,
    })]
);

const findRelevantArticle = (articleId: ArticleId) => (listResource: ListWriteModel) => pipe(
  listResource.expressions,
  RA.findFirst((expression) => expression.expressionDoi === articleId.value),
  E.fromOption(() => toErrorMessage('Article not in list')),
);
const isAnnotationValid = (command: AnnotateArticleInListCommand) => () => (
  isAnnotationLengthValid(command.annotationContent)
);

export const annotate: ResourceAction<AnnotateArticleInListCommand> = (command) => (events) => pipe(
  events,
  E.right,
  E.filterOrElse(
    doesListExist(command.listId),
    () => toErrorMessage('not-found'),
  ),
  E.chain(getListWriteModel(command.listId)),
  E.chain(findRelevantArticle(command.expressionDoi)),
  E.filterOrElseW(
    isAnnotationValid(command),
    () => toErrorMessage('Annotation too long'),
  ),
  E.map(createAppropriateEvents(command)),
);
