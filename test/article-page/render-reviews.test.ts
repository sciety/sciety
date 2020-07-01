import { JSDOM } from 'jsdom';
import { Maybe } from 'true-myth';
import { RenderReview, Review } from '../../src/article-page/render-review';
import createRenderReviews from '../../src/article-page/render-reviews';
import Doi from '../../src/types/doi';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-reviews component', () => {
  const doi = new Doi('10.1111/1111');

  describe('when there are reviews', (): void => {
    const reviews: Array<Review> = [{
      publicationDate: Maybe.nothing(),
      summary: Maybe.nothing(),
      url: new URL('https://doi.org/10.5281/zenodo.3678326'),
      editorialCommunityId: '',
      editorialCommunityName: '',
    }];
    const dummyRenderReview: RenderReview = () => 'review';

    it('renders a HTML section', async () => {
      const renderReviews = createRenderReviews(dummyRenderReview, async () => reviews, 'expectedValue');
      const rendered = await renderReviews(doi);
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.nodeName).toBe('SECTION');
    });

    it('has the correct HTML id attribute', async () => {
      const renderReviews = createRenderReviews(dummyRenderReview, async () => reviews, 'expectedValue');
      const rendered = await renderReviews(doi);
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.getAttribute('id')).toBe('expectedValue');
    });
  });

  describe('when there are no reviews', (): void => {
    it('renders nothing', async () => {
      const renderReviews = createRenderReviews(shouldNotBeCalled, async () => [], 'arbitraryId');
      const rendered = await renderReviews(doi);

      expect(rendered).toStrictEqual('');
    });
  });
});
