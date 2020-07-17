import createAdapter from '../../src/editorial-community-page/get-number-of-reviews-from-review-references';
import Doi from '../../src/types/doi';
import ReviewReference from '../../src/types/review-reference';

describe('get-number-of-reviews-from-review-references', (): void => {
  it('returns number of review references', async (): Promise<void> => {
    const findReviewReferences = async (): Promise<ReadonlyArray<ReviewReference>> => [
      {
        articleVersionDoi: new Doi('10.1111/1111'),
        reviewId: new Doi('10.3333/3333'),
        editorialCommunityId: '1',
        added: new Date(),
      },
      {
        articleVersionDoi: new Doi('10.2222/2222'),
        reviewId: new Doi('10.3333/3333'),
        editorialCommunityId: '1',
        added: new Date(),
      },
    ];
    const getNumberOfReviews = createAdapter(findReviewReferences);
    const reviews = await getNumberOfReviews('1');

    expect(reviews).toStrictEqual(2);
  });
});
