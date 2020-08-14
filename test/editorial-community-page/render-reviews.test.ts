import { JSDOM } from 'jsdom';
import createRenderReviews, { GetNumberOfReviews } from '../../src/editorial-community-page/render-reviews';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-reviews', (): void => {
  it('displays a count of reviews', async (): Promise<void> => {
    const getNumberOfReviews: GetNumberOfReviews = async () => 17;
    const renderReviews = createRenderReviews(getNumberOfReviews);
    const editorialCommunityId = new EditorialCommunityId('1');
    const renderedPage = (await renderReviews(editorialCommunityId));
    const rendered = JSDOM.fragment(renderedPage);

    expect(rendered.querySelector('[data-test-id="reviewsCount"]')?.textContent).toStrictEqual('17');
  });
});
