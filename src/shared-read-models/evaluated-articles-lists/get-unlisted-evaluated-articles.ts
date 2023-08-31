import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { ArticleState, ReadModel } from './handle-event';
import { ListId } from '../../types/list-id';

const hasBeenEvaluated = (a: ArticleState): boolean => a.evaluatedBy.length > 0;

const listsFromWhichTheArticleIsMissing = (groups: ReadModel['groups']) => (a: ArticleState) => pipe(
  a.evaluatedBy,
  RA.filter((groupId) => groups.has(groupId)),
  RA.map((groupId) => groups.get(groupId)),
  RA.map(O.fromNullable),
  RA.compact,
  RA.filter((listId) => !a.listedIn.includes(listId)),
);

type MissingArticle = {
  articleId: string,
  listId: ListId,
};

const toMissingArticleObjects = (
  articleId: string,
  listIds: ReadonlyArray<ListId>,
): ReadonlyArray<MissingArticle> => pipe(
  listIds,
  RA.map((listId) => ({
    articleId,
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
