import { JSDOM } from 'jsdom';
import createRenderFeed, { GetActor } from '../../src/home-page/render-feed';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const dummyGetActor: GetActor = async () => ({
      name: 'something',
      url: '',
      imageUrl: '',
    });
    const renderFeed = createRenderFeed(dummyGetActor);
    const rendered = JSDOM.fragment(await renderFeed());

    expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
  });
});
