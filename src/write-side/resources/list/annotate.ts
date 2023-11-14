import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { toHtmlFragment } from '../../../types/html-fragment';
import { constructEvent } from '../../../domain-events';
import { AnnotateArticleInListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';
import { getListWriteModel } from './get-list-write-model';
import { ListWriteModel } from './list-write-model';
import { ArticleId } from '../../../types/article-id';
import { toErrorMessage } from '../../../types/error-message';

const createAppropriateEvents = (command: AnnotateArticleInListCommand) => (article: ListWriteModel['articles'][number]) => (
  article.annotated
    ? []
    : [constructEvent('ArticleInListAnnotated')({ articleId: command.articleId, listId: command.listId, content: toHtmlFragment(command.content) })]
);

const findRelevantArticle = (articleId: ArticleId) => (listResource: ListWriteModel) => pipe(
  listResource.articles,
  RA.findFirst((article) => article.articleId.value === articleId.value),
  E.fromOption(() => toErrorMessage('Article not in list')),
);
const validateAnnotation = (command: AnnotateArticleInListCommand) => (article: ListWriteModel['articles'][number]) => (
  command.content.length > 4000
    ? E.left(toErrorMessage('Annotation too long'))
    : E.right(article)
);

export const annotate: ResourceAction<AnnotateArticleInListCommand> = (command) => (events) => pipe(
  events,
  getListWriteModel(command.listId),
  E.chain(findRelevantArticle(command.articleId)),
  E.chainW(validateAnnotation(command)),
  E.map(createAppropriateEvents(command)),
);
