import { JSDOM } from 'jsdom';
import createRenderReviewSummaries from '../../src/article-page/render-review-summaries';

describe('review summaries component', () => {
  it('has the correct HTML id attribute', async () => {
    const renderReviewSummaries = createRenderReviewSummaries(async () => [], 'expectedValue');
    const rendered = await renderReviewSummaries();
    const reviews = JSDOM.fragment(rendered).firstElementChild;

    expect(reviews?.getAttribute('id')).toBe('expectedValue');
  });
});
