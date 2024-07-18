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
import { AnnotateArticleInListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const createAppropriateEvents = (command: AnnotateArticleInListCommand) => (article: ListWriteModel['articles'][number]) => (
  article.annotated
    ? []
    : [constructEvent('ArticleInListAnnotated')({ articleId: command.articleId, listId: command.listId, content: command.annotationContent })]
);

const findRelevantArticle = (articleId: ArticleId) => (listResource: ListWriteModel) => pipe(
  listResource.articles,
  RA.findFirst((article) => article.articleId.value === articleId.value),
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
  E.chain(findRelevantArticle(command.articleId)),
  E.filterOrElseW(
    isAnnotationValid(command),
    () => toErrorMessage('Annotation too long'),
  ),
  E.map(createAppropriateEvents(command)),
);
