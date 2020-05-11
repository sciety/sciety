import Doi from '../../src/data/doi';
import templateReviewSummary from '../../src/templates/review-summary';

describe('review-summary template', (): void => {
  const review = {
    publicationDate: new Date('2010-02-01'),
    summary: 'Pretty good.',
    doi: new Doi('10.5281/zenodo.3678326'),
  };
  const idNamespace = 'review-42';

  it('renders inside an article tag', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringMatching(/^<article\s/));
  });

  it('renders the summary', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringContaining(review.summary));
  });

  it('renders the link to a full review', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringContaining(`href="https://doi.org/${review.doi}"`));
  });

  it('renders the editorial community', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringContaining('eLife'));
  });

  it('renders the publication date', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringContaining('2010-02-01'));
  });

  it('renders ARIA attributes and ids', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringContaining('aria-labelledby="review-42-read-more review-42-editorial-community"'));
  });
});
