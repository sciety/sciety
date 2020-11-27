import { reviewResponse } from '../../src/respond/review-response';
import Doi from '../../src/types/doi';
import toUserId from '../../src/types/user-id';

describe('review-response', () => {
  const userId = toUserId('fred');
  const reviewId = new Doi('10.1101/111111');

  it.each([
    ['no events', [], 'none'],
  ])('given %s', (_, events, expected) => {
    expect(reviewResponse(userId, reviewId)(events)).toStrictEqual(expected);
  });
});
