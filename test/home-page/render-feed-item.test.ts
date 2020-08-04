import createRenderFeedItem, { ArticleEndorsedEvent, GetActor, GetArticle } from '../../src/home-page/render-feed-item';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-feed-item', (): void => {
  describe('when given an ArticleEndorsedEvent', () => {
    it('displays the article title', async () => {
      const articleTitle = 'the title';
      const event: ArticleEndorsedEvent = {
        actorId: new EditorialCommunityId(''),
        articleId: new Doi('10.5281/zenodo.3678326'),
        date: new Date(),
        type: 'ArticleEndorsed',
      };
      const dummyGetActor: GetActor = async () => ({
        url: '',
        name: '',
        imageUrl: '',
      });
      const getArticle: GetArticle = async () => ({
        title: articleTitle,
      });

      const renderFeedItem = createRenderFeedItem(dummyGetActor, getArticle);
      const rendered = await renderFeedItem(event);

      expect(rendered).toStrictEqual(expect.stringContaining(articleTitle));
    });

    it.todo('displays the word "endorsed"');

    it.todo('displays the actor name');

    it.todo('displays the event date');
  });

  describe('when given an ArticleReviewedEvent', () => {
    it.todo('displays the article title');

    it.todo('displays the word "reviewed"');

    it.todo('displays the actor name');

    it.todo('displays the event date');
  });

  describe('when given an EditorialCommunityJoinedEvent', () => {
    it.todo('displays the actor name');

    it.todo('displays the word "joined"');

    it.todo('displays the event date');
  });
});
