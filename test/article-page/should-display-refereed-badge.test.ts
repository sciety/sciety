import { pipe } from 'fp-ts/function';
import { shouldDisplayRefereedBadge } from '../../src/article-page/should-display-refereed-badge';
import { evaluationRecorded, groupCreated } from '../../src/domain-events';
import { fromValidatedString } from '../../src/types/group-id';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroup } from '../types/group.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('should-display-refereed-badge', () => {
  const articleId = arbitraryDoi();
  const screenItId = fromValidatedString('8ccea9c2-e6c8-4dd7-bf1d-37c3fa86ff65');
  const humanGroup = arbitraryGroup();

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
    describe('only by ScreenIT', () => {
      const result = pipe(
        [
          evaluationRecorded(screenItId, articleId, arbitraryReviewId()),
        ],
        shouldDisplayRefereedBadge(articleId),
      );

      it('should not show badge', () => {
        expect(result).toBe(false);
      });
    });

    describe('none are by ScreenIT', () => {
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

    describe('some by ScreenIT, some by other groups', () => {
      const result = pipe(
        [
          groupCreated(humanGroup),
          evaluationRecorded(screenItId, articleId, arbitraryReviewId()),
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
