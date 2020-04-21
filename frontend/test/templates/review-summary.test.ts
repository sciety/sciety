import templateReviewSummary from '../../src/templates/review-summary';

describe('review-summary template', (): void => {
  const review = {
    author: 'John Doe',
    publicationDate: new Date('2010-02-01'),
    summary: 'Pretty good.',
    url: 'https://example.com/some-review',
  };
  const idNamespace = 'review-42';

  it('renders the summary', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toEqual(expect.stringContaining(review.summary));
  });

  it('renders the link to a full review', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toEqual(expect.stringContaining(`href="${review.url}"`));
  });

  it('renders the author', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toEqual(expect.stringContaining(review.author));
  });

  it('renders the publication date', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toEqual(expect.stringContaining('2010-02-01'));
  });

  it('renders ARIA attributes and ids', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toEqual(expect.stringContaining('aria-labelledby="review-42-read-more review-42-author"'));
  });
});
