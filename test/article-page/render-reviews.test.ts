import { JSDOM } from 'jsdom';
import createRenderReviews from '../../src/article-page/render-reviews';
import Doi from '../../src/data/doi';

describe('render-reviews component', () => {
  describe('when there are reviews', (): void => {
    const reviews = [{
      publicationDate: new Date(),
      summary: 'Not used',
      doi: new Doi('10.1111/1111'),
      editorialCommunityId: '',
      editorialCommunityName: '',
    }];

    it('renders a HTML section', async () => {
      const renderReviews = createRenderReviews(async () => reviews, 'expectedValue');
      const rendered = await renderReviews();
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.nodeName).toBe('SECTION');
    });

    it('has the correct HTML id attribute', async () => {
      const renderReviews = createRenderReviews(async () => reviews, 'expectedValue');
      const rendered = await renderReviews();
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.getAttribute('id')).toBe('expectedValue');
    });
  });

  describe('when there are no reviews', (): void => {
    it('renders nothing', async () => {
      const renderReviews = createRenderReviews(async () => [], 'arbitraryId');
      const rendered = await renderReviews();

      expect(rendered).toStrictEqual('');
    });
  });
});
