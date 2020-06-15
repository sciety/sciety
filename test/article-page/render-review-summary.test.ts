import templateReviewSummary from '../../src/article-page/render-review-summary';
import Doi from '../../src/data/doi';

describe('render-review-summary component', (): void => {
  const review = {
    publicationDate: new Date('2010-02-01'),
    summary: 'Pretty good.',
    doi: new Doi('10.5281/zenodo.3678326'),
    editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    editorialCommunityName: 'eLife',
  };
  const idNamespace = 'review-42';

  it('renders inside an article tag', () => {
    const actual = templateReviewSummary(review, idNamespace);

    expect(actual).toStrictEqual(expect.stringMatching(/^\s*<article\s/));
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
