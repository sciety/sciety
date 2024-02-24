import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events/index.js';
import { AnnotateArticleInListCommand } from '../../commands/index.js';
import { ResourceAction } from '../resource-action.js';
import { getListWriteModel } from './get-list-write-model.js';
import { ListWriteModel } from './list-write-model.js';
import { ArticleId } from '../../../types/article-id.js';
import { toErrorMessage } from '../../../types/error-message.js';
import { isAnnotationLengthValid } from './is-annotation-length-valid.js';

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
  getListWriteModel(command.listId),
  E.chain(findRelevantArticle(command.articleId)),
  E.filterOrElseW(
    isAnnotationValid(command),
    () => toErrorMessage('Annotation too long'),
  ),
  E.map(createAppropriateEvents(command)),
);
