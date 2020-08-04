import createRenderFeedItem, {
  ArticleEndorsedEvent, ArticleReviewedEvent, GetActor, GetArticle,
} from '../../src/home-page/render-feed-item';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';

describe('render-feed-item', (): void => {
  const articleTitle = 'the title';
  const arbitraryActorId = new EditorialCommunityId('');
  const arbitraryArticleId = new Doi('10.5281/zenodo.3678326');
  const dummyGetActor: GetActor = async () => ({
    url: '',
    name: '',
    imageUrl: '',
  });

  describe('when given an ArticleEndorsedEvent', () => {
    it('displays the article title', async () => {
      const event: ArticleEndorsedEvent = {
        actorId: arbitraryActorId,
        articleId: arbitraryArticleId,
        date: new Date(),
        type: 'ArticleEndorsed',
      };
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
    it('displays the article title', async () => {
      const event: ArticleReviewedEvent = {
        type: 'ArticleReviewed',
        date: new Date(),
        actorId: arbitraryActorId,
        articleId: arbitraryArticleId,
      };
      const getArticle: GetArticle = async () => ({
        title: articleTitle,
      });
      const renderFeedItem = createRenderFeedItem(dummyGetActor, getArticle);
      const rendered = await renderFeedItem(event);

      expect(rendered).toStrictEqual(expect.stringContaining(articleTitle));
    });

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
