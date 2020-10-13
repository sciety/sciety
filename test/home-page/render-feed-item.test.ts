import { Result } from 'true-myth';
import createRenderFeedItem, { GetActor, GetArticle } from '../../src/home-page/render-feed-item';
import Doi from '../../src/types/doi';
import { EditorialCommunityEndorsedArticleEvent, EditorialCommunityReviewedArticleEvent } from '../../src/types/domain-events';
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

  describe('when given an EditorialCommunityEndorsedArticleEvent', () => {
    const event: EditorialCommunityEndorsedArticleEvent = {
      editorialCommunityId: arbitraryActorId,
      articleId: arbitraryArticleId,
      date: new Date(),
      type: 'EditorialCommunityEndorsedArticle',
    };
    let rendered: string;

    describe('and the article information can be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.ok({
          title: articleTitle,
        });
        const renderFeedItem = createRenderFeedItem(dummyGetActor, getArticle);
        rendered = await renderFeedItem(event);
      });

      it('displays the article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining(articleTitle));
      });

      it('displays the word "endorsed"', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('endorsed'));
      });

      it.todo('displays the actor name');

      it.todo('displays the event date');
    });

    describe('and the article information cannot be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.err('something-bad');
        const renderFeedItem = createRenderFeedItem(dummyGetActor, getArticle);
        rendered = await renderFeedItem(event);
      });

      it('displays a generic article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('an article'));
      });

      it.todo('displays the word "endorsed"');

      it.todo('displays the actor name');

      it.todo('displays the event date');
    });
  });

  describe('when given an EditorialCommunityReviewedArticleEvent', () => {
    const event: EditorialCommunityReviewedArticleEvent = {
      type: 'EditorialCommunityReviewedArticle',
      date: new Date(),
      editorialCommunityId: arbitraryActorId,
      articleId: arbitraryArticleId,
      reviewId: new Doi('10.1234/5678'),
    };
    let rendered: string;

    describe('and the article information can be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.ok({
          title: articleTitle,
        });
        const renderFeedItem = createRenderFeedItem(dummyGetActor, getArticle);
        rendered = await renderFeedItem(event);
      });

      it('displays the article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining(articleTitle));
      });

      it('displays the word "reviewed"', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('reviewed'));
      });

      it.todo('displays the actor name');

      it.todo('displays the event date');
    });

    describe('and the article information cannot be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.err('something-bad');
        const renderFeedItem = createRenderFeedItem(dummyGetActor, getArticle);
        rendered = await renderFeedItem(event);
      });

      it('displays a generic article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('an article'));
      });

      it.todo('displays the word "reviewed"');

      it.todo('displays the actor name');

      it.todo('displays the event date');
    });
  });
});
