import { JSDOM } from 'jsdom';
import { RenderReview } from '../../src/article-page/render-review';
import createRenderReviews from '../../src/article-page/render-reviews';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-reviews component', () => {
  const doi = new Doi('10.1111/1111');

  describe('when there are reviews', (): void => {
    const reviews = [{
      reviewId: new Doi('10.5281/zenodo.3678326'),
      editorialCommunityId: new EditorialCommunityId(''),
    }];
    const dummyRenderReview: RenderReview = async () => 'review';

    it('renders a HTML section', async () => {
      const renderReviews = createRenderReviews(dummyRenderReview, async () => reviews, 'expectedValue');
      const rendered = (await renderReviews(doi)).unsafelyUnwrap();
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.nodeName).toBe('SECTION');
    });

    it('has the correct HTML id attribute', async () => {
      const renderReviews = createRenderReviews(dummyRenderReview, async () => reviews, 'expectedValue');
      const rendered = (await renderReviews(doi)).unsafelyUnwrap();
      const reviewsElement = JSDOM.fragment(rendered).firstElementChild;

      expect(reviewsElement?.getAttribute('id')).toBe('expectedValue');
    });
  });

  describe('when there are no reviews', (): void => {
    it('renders nothing', async () => {
      const renderReviews = createRenderReviews(shouldNotBeCalled, async () => [], 'arbitraryId');
      const rendered = await renderReviews(doi);

      expect(rendered.isErr()).toBe(true);
    });
  });
});
