import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../../src/domain-events';
import { getActivityForDoi } from '../../../src/shared-read-models/article-activity';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('get-activity-for-doi', () => {
  const articleId = arbitraryDoi();

  describe('when an article has no evaluations', () => {
    const articleActivity = pipe(
      [],
      getActivityForDoi(articleId),
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
    const earlierPublishedDate = new Date(1900);
    const laterPublishedDate = new Date(2000);
    const articleActivity = pipe(
      [
        evaluationRecorded(
          arbitraryGroupId(),
          articleId,
          arbitraryReviewId(),
          arbitraryDate(),
          [],
          earlierPublishedDate,
        ),
        evaluationRecorded(
          arbitraryGroupId(),
          articleId,
          arbitraryReviewId(),
          arbitraryDate(),
          [],
          laterPublishedDate,
        ),
      ],
      getActivityForDoi(articleId),
    );

    it('returns the activity for that article', () => {
      expect(articleActivity).toStrictEqual({
        doi: articleId,
        latestActivityDate: O.some(laterPublishedDate),
        evaluationCount: 2,
      });
    });
  });
});
