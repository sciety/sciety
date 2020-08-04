import { JSDOM } from 'jsdom';
import createRenderFeed, { GetActor, GetArticle, GetEvents } from '../../src/home-page/render-feed';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-feed', (): void => {
  it('returns a list', async (): Promise<void> => {
    const dummyGetEvents: GetEvents = async () => [
      {
        type: 'EditorialCommunityJoined',
        date: new Date(),
        actorId: new EditorialCommunityId(''),
      },
    ];
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
