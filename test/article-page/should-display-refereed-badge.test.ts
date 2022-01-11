import { pipe } from 'fp-ts/function';
import { shouldDisplayRefereedBadge } from '../../src/article-page/should-display-refereed-badge';
import { evaluationRecorded, groupCreated } from '../../src/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('should-display-refereed-badge', () => {
  const articleId = arbitraryDoi();
  const humanGroup = arbitraryGroup();
  const automatedGroup = {
    ...arbitraryGroup(),
    isAutomated: true,
  };

  describe('when there are no evaluations', () => {
    const result = pipe(
      [],
      shouldDisplayRefereedBadge(articleId),
    );

    it('should not show badge', () => {
      expect(result).toBe(false);
    });
  });

  describe('when there are evaluations', () => {
    describe('only by automated groups', () => {
      const result = pipe(
        [
          groupCreated(automatedGroup),
          evaluationRecorded(automatedGroup.id, articleId, arbitraryReviewId()),
        ],
        shouldDisplayRefereedBadge(articleId),
      );

      it('should not show badge', () => {
        expect(result).toBe(false);
      });
    });

    describe('none are by automated groups', () => {
      const result = pipe(
        [
          groupCreated(humanGroup),
          evaluationRecorded(humanGroup.id, articleId, arbitraryReviewId()),
        ],
        shouldDisplayRefereedBadge(articleId),
      );

      it('should show badge', () => {
        expect(result).toBe(true);
      });
    });

    describe('some by automated groups, some by other groups', () => {
      const result = pipe(
        [
          groupCreated(humanGroup),
          groupCreated(automatedGroup),
          evaluationRecorded(automatedGroup.id, articleId, arbitraryReviewId()),
          evaluationRecorded(humanGroup.id, articleId, arbitraryReviewId()),
        ],
        shouldDisplayRefereedBadge(articleId),
      );

      it('should show badge', () => {
        expect(result).toBe(true);
      });
    });
  });
});
