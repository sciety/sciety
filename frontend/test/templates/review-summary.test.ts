import templateReviewSummary from '../../src/templates/review-summary';

describe('review-summary template', (): void => {
  it('renders the summary of a review', () => {
    const review = {
      summary: 'Pretty good.',
    };
    const actual = templateReviewSummary(review);

    expect(actual).toEqual(expect.stringContaining(review.summary));
  });
});
