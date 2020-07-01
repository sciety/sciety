import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import createRenderReview, { Review } from '../../src/article-page/render-review';

describe('render-review component', (): void => {
  const review: Review = {
    publicationDate: Maybe.just(new Date('2010-02-01')),
    summary: Maybe.just('Pretty good.'),
    url: new URL('https://doi.org/10.5281/zenodo.3678326'),
    editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
    editorialCommunityName: 'eLife',
  };
  const idNamespace = 'review-42';

  describe('when the review fits without truncation', (): void => {
    let actual: string;

    beforeEach((): void => {
      actual = createRenderReview(1500)(review, idNamespace);
    });

    it('renders inside an article tag', () => {
      expect(actual).toStrictEqual(expect.stringMatching(/^\s*<article\s/));
    });

    it('renders the summary', () => {
      expect(actual).toStrictEqual(expect.stringContaining('Pretty good.'));
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
      const actual = createRenderReview(6)(review, idNamespace);

      expect(actual).toStrictEqual(expect.stringContaining('Prett'));
    });
  });

  describe('when the review summary is not available', (): void => {
    it('does not render the summary markup', () => {
      const reviewWithoutSummary: Review = {
        publicationDate: Maybe.just(new Date('2010-02-01')),
        url: new URL('https://doi.org/10.5281/zenodo.3678326'),
        summary: Maybe.nothing(),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        editorialCommunityName: 'eLife',
      };

      const rendered = JSDOM.fragment(createRenderReview(6)(reviewWithoutSummary, idNamespace));

      expect(rendered.querySelector('[data-test-id="reviewSummary"]')).toBeNull();
    });
  });

  describe('when the review publication date is not available', (): void => {
    it('does not render any date markup', () => {
      const reviewWithoutPublicationDate: Review = {
        publicationDate: Maybe.nothing(),
        url: new URL('https://doi.org/10.5281/zenodo.3678326'),
        summary: Maybe.just('Pretty good.'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        editorialCommunityName: 'eLife',
      };

      const rendered = JSDOM.fragment(createRenderReview(6)(reviewWithoutPublicationDate, idNamespace));

      expect(rendered.querySelector('[data-test-id="reviewPublicationDate"]')).toBeNull();
    });
  });
});
