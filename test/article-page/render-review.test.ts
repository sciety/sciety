import { JSDOM } from 'jsdom';
import renderReview from '../../src/article-page/render-review';

describe('render-review component', (): void => {
  const review = {
    publicationDate: new Date('2010-02-01'),
    summary: 'Pretty good.',
    url: new URL('https://doi.org/10.5281/zenodo.3678326'),
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
      expect(actual).toStrictEqual(expect.stringContaining('href="https://doi.org/10.5281/zenodo.3678326"'));
    });

    it('renders the editorial community', () => {
      expect(actual).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('renders the publication date', () => {
      const rendered = JSDOM.fragment(actual);

      expect(rendered.querySelector('[data-test-id="reviewPublicationDate"]')?.textContent).toStrictEqual('Feb 1, 2010');
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

  describe('when the review summary is not available', (): void => {
    it('does not render the summary markup', () => {
      const reviewWithoutSummary = {
        url: new URL('https://doi.org/10.5281/zenodo.3678326'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        editorialCommunityName: 'eLife',
      };

      const rendered = JSDOM.fragment(renderReview(reviewWithoutSummary, idNamespace, 6));

      expect(rendered.querySelector('[data-test-id="reviewSummary"]')).toBeNull();
    });
  });

  describe('when the review publication date is not available', (): void => {
    it('does not render any date markup', () => {
      const reviewWithoutPublicationDate = {
        url: new URL('https://doi.org/10.5281/zenodo.3678326'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        editorialCommunityName: 'eLife',
      };

      const rendered = JSDOM.fragment(renderReview(reviewWithoutPublicationDate, idNamespace, 6));

      expect(rendered.querySelector('[data-test-id="reviewPublicationDate"]')).toBeNull();
    });
  });
});
