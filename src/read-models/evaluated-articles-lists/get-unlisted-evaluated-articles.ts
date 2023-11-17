import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { ArticleState, ReadModel } from './handle-event.js';
import { ListId } from '../../types/list-id.js';
import { ArticleId } from '../../types/article-id.js';

const hasBeenEvaluated = (a: ArticleState): boolean => a.evaluatedBy.length > 0;

const listsThatShouldContainTheArticle = (groupsToEvaluatedArticlesLists: ReadModel['groups']) => (a: ArticleState) => pipe(
  a.evaluatedBy,
  RA.map((groupId) => groupsToEvaluatedArticlesLists.get(groupId)),
  RA.map(O.fromNullable),
  RA.compact,
);

const doesNotContainTheArticle = (a: ArticleState) => (listId: ListId) => !a.listedIn.includes(listId);

const listsFromWhichTheArticleIsMissing = (groupsToEvaluatedArticlesLists: ReadModel['groups']) => (a: ArticleState) => pipe(
  a,
  listsThatShouldContainTheArticle(groupsToEvaluatedArticlesLists),
  RA.filter(doesNotContainTheArticle(a)),
);

type MissingArticle = {
  articleId: ArticleId,
  listId: ListId,
};

const toMissingArticleObjects = (
  articleId: string,
  listIds: ReadonlyArray<ListId>,
): ReadonlyArray<MissingArticle> => pipe(
  listIds,
  RA.map((listId) => ({
    articleId: new ArticleId(articleId),
    listId,
  })),
);

export const getUnlistedEvaluatedArticles = (readmodel: ReadModel) => (): ReadonlyArray<MissingArticle> => pipe(
  readmodel.articles,
  RM.filter(hasBeenEvaluated),
  RM.map(listsFromWhichTheArticleIsMissing(readmodel.groups)),
  RM.filter((lists) => lists.length > 0),
  RM.collect(S.Ord)(toMissingArticleObjects),
  RA.flatten,
);
