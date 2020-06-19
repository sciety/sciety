import { JSDOM } from 'jsdom';
import createRenderReviewSummaries from '../../src/article-page/render-review-summaries';
import Doi from '../../src/data/doi';

describe('review summaries component', () => {
  describe('when there are reviews', (): void => {
    const reviews = [{
      publicationDate: new Date(),
      summary: 'Not used',
      doi: new Doi('10.1111/1111'),
      editorialCommunityId: '',
      editorialCommunityName: '',
    }];

    it('renders a HTML section', async () => {
      const renderReviewSummaries = createRenderReviewSummaries(async () => reviews, 'expectedValue');
      const rendered = await renderReviewSummaries();
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.nodeName).toBe('SECTION');
    });

    it('has the correct HTML id attribute', async () => {
      const renderReviewSummaries = createRenderReviewSummaries(async () => reviews, 'expectedValue');
      const rendered = await renderReviewSummaries();
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.getAttribute('id')).toBe('expectedValue');
    });
  });

  describe('when there are no reviews', (): void => {
    it('renders nothing', async () => {
      const renderReviewSummaries = createRenderReviewSummaries(async () => [], 'arbitraryId');
      const rendered = await renderReviewSummaries();

      expect(rendered).toStrictEqual('');
    });
  });
});
