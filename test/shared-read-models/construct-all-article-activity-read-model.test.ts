import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { groupEvaluatedArticle } from '../../src/domain-events';
import { constructAllArticleActivityReadModel, getActivityForDoi } from '../../src/shared-read-models/article-activity/construct-all-article-activity-read-model';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('construct-all-article-activity-read-model', () => {
  const articleId = arbitraryDoi();

  describe('when an article has no evaluations', () => {
    const articleActivity = pipe(
      [],
      constructAllArticleActivityReadModel,
      (readModel) => getActivityForDoi(readModel)(articleId),
    );

    it('article has no activity', () => {
      expect(articleActivity).toStrictEqual({
        doi: articleId,
        latestActivityDate: O.none,
        evaluationCount: 0,
      });
    });
  });

  describe('when an article has one or more evaluations', () => {
    const earlierDate = new Date(1900);
    const laterDate = new Date(2000);
    const articleActivity = pipe(
      [
        groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId(), earlierDate),
        groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId(), laterDate),
      ],
      constructAllArticleActivityReadModel,
      (readModel) => getActivityForDoi(readModel)(articleId),
    );

    it('returns the activity for that article', () => {
      expect(articleActivity).toStrictEqual({
        doi: articleId,
        latestActivityDate: O.some(laterDate),
        evaluationCount: 2,
      });
    });
  });
});
