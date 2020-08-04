import { JSDOM } from 'jsdom';
import createRenderFeed, { GetActor, GetArticle, GetEvents } from '../../src/home-page/render-feed';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const dummyGetEvents: GetEvents = async () => [];
    const dummyGetActor: GetActor = async () => ({
      name: 'something',
      url: '',
      imageUrl: '',
    });
    const dummyGetArticle: GetArticle = async () => ({
      title: 'something',
    });
    const renderFeed = createRenderFeed(dummyGetEvents, dummyGetActor, dummyGetArticle);
    const rendered = JSDOM.fragment(await renderFeed());

    expect(rendered.querySelector('.ui.feed')?.tagName).toBe('OL');
  });
});
