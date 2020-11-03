import createProjectReviewResponseCounts from '../../src/article-page/project-review-response-counts';
import Doi from '../../src/types/doi';

describe('project-review-response-counts', () => {
  describe('given no events', () => {
    it('returns 0 `helpful` and 0 `not helpful`', async () => {
      const reviewId = new Doi('10.1234/5678');

      const projectReviewResponseCounts = createProjectReviewResponseCounts(async () => []);
      const projected = await projectReviewResponseCounts(reviewId);

      expect(projected).toStrictEqual({ helpfulCount: 0, notHelpfulCount: 0 });
    });
  });

  describe('given N different users responded helpful events', () => {
    it.todo('returns N `helpful` and 0 `not helpful`');
  });

  describe('given a single user responded helpful and revoked the helpful response', () => {
    it.todo('returns 0 `helpful` and 0 `not helpful`');
  });

  describe('given a single user responded: helpful, revoke helpful, not helpful, revoke not helpful', () => {
    it.todo('returns 0 `helpful` and 0 `not helpful`');
  });
});
