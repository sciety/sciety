import renderReview from '../../src/article-page/render-review';
import Doi from '../../src/data/doi';

describe('render-review component', (): void => {
  const review = {
    publicationDate: new Date('2010-02-01'),
    summary: 'Pretty good.',
    doi: new Doi('10.5281/zenodo.3678326'),
    editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    editorialCommunityName: 'eLife',
  };
  const idNamespace = 'review-42';

  describe('when the review fits without truncation', (): void => {
    let actual: string;

    beforeEach((): void => {
      actual = renderReview(review, idNamespace, 1500);
    });

    it('renders inside an article tag', () => {
      expect(actual).toStrictEqual(expect.stringMatching(/^\s*<article\s/));
    });

    it('renders the summary', () => {
      expect(actual).toStrictEqual(expect.stringContaining(review.summary));
    });

    it('renders the link to a full review', () => {
      expect(actual).toStrictEqual(expect.stringContaining(`href="https://doi.org/${review.doi}"`));
    });

    it('renders the editorial community', () => {
      expect(actual).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('renders the publication date', () => {
      expect(actual).toStrictEqual(expect.stringContaining('2010-02-01'));
    });

    it('renders ARIA attributes and ids', () => {
      expect(actual).toStrictEqual(expect.stringContaining('aria-labelledby="review-42-read-more review-42-editorial-community"'));
    });
  });

  describe('when the review summary is very long', (): void => {
    it('renders the summary truncated', () => {
      const actual = renderReview(review, idNamespace, 6);

      expect(actual).toStrictEqual(expect.stringContaining('Prett'));
    });
  });
});
