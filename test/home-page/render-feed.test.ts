import { JSDOM } from 'jsdom';
import createRenderFeed from '../../src/home-page/render-feed';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const renderFeed = createRenderFeed();
    const rendered = JSDOM.fragment(await renderFeed());

    expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
  });
});
