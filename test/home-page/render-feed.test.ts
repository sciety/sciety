import { JSDOM } from 'jsdom';
import createRenderFeed, { GetActor, GetArticle } from '../../src/home-page/render-feed';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const dummyGetActor: GetActor = async () => ({
      name: 'something',
      url: '',
      imageUrl: '',
    });
    const dummyGetArticle: GetArticle = async () => ({
      title: 'something',
    });
    const renderFeed = createRenderFeed(dummyGetActor, dummyGetArticle);
    const rendered = JSDOM.fragment(await renderFeed());

    expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
  });
});
