import templateReviewSummary from '../../src/templates/review-summary';

describe('review-summary template', (): void => {
  const review = {
    summary: 'Pretty good.',
    url: 'https://example.com/some-review',
  };

  it('renders the summary of a review', () => {
    const actual = templateReviewSummary(review);

    expect(actual).toEqual(expect.stringContaining(review.summary));
  });

  it('renders the link to a full review', () => {
    const actual = templateReviewSummary(review);

    expect(actual).toEqual(expect.stringContaining(`<a href="${review.url}">`));
  });
});
