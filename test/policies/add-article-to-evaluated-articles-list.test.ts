import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../src/domain-events';
import { constructCommand } from '../../src/policies/add-article-to-evaluated-articles-list';
import { dummyLogger } from '../dummy-logger';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';
import { arbitraryDate } from '../helpers';

describe('add-article-to-evaluated-articles-list', () => {
  const ports = {
    logger: dummyLogger,
  };

  describe('when the group has an evaluated articles list', () => {
    const articleId = arbitraryArticleId();
    const listId = arbitraryListId();
    const groupId = arbitraryGroupId();

    const command = pipe(
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], arbitraryDate()),
      constructCommand({
        ...ports,
        getEvaluatedArticlesListIdForGroup: () => O.some(listId),
      }),
    );

    it('returns a command', () => {
      expect(command).toStrictEqual(E.right({
        articleId,
        listId,
      }));
    });
  });

  describe('when the group does not have an evaluated articles list', () => {
    const command = pipe(
      evaluationRecorded(arbitraryGroupId(), arbitraryArticleId(), arbitraryReviewId(), [], arbitraryDate()),
      constructCommand({
        ...ports,
        getEvaluatedArticlesListIdForGroup: () => O.none,
      }),
    );

    it('returns nothing to do', () => {
      expect(E.isLeft(command)).toBe(true);
    });
  });
});
