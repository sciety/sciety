import { Result } from 'true-myth';
import createRenderSummaryFeedItem, { GetActor, GetArticle } from '../../src/shared-components/render-summary-feed-item';
import Doi from '../../src/types/doi';
import { EditorialCommunityEndorsedArticleEvent, EditorialCommunityReviewedArticleEvent } from '../../src/types/domain-events';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';

describe('render-summary-feed-item', (): void => {
  const articleTitle = toHtmlFragment('the title');
  const arbitraryActorId = new EditorialCommunityId('');
  const arbitraryArticleId = new Doi('10.5281/zenodo.3678326');
  const dummyGetActor: GetActor = async () => ({
    url: '',
    name: 'dummyActorName',
    imageUrl: '',
  });

  describe('when given an EditorialCommunityEndorsedArticleEvent', () => {
    const event: EditorialCommunityEndorsedArticleEvent = {
      editorialCommunityId: arbitraryActorId,
      articleId: arbitraryArticleId,
      date: new Date('2020-01-01'),
      type: 'EditorialCommunityEndorsedArticle',
    };
    let rendered: string;

    describe('and the article information can be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.ok({
          title: articleTitle,
        });
        const renderSummaryFeedItem = createRenderSummaryFeedItem(dummyGetActor, getArticle);
        rendered = await renderSummaryFeedItem(event);
      });

      it('displays the article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining(articleTitle));
      });

      it('displays the word "endorsed"', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('endorsed'));
      });

      it('displays the actor name', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('dummyActorName'));
      });

      it('displays the event date', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('Jan 1, 2020'));
      });
    });

    describe('and the article information cannot be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.err('something-bad');
        const renderSummaryFeedItem = createRenderSummaryFeedItem(dummyGetActor, getArticle);
        rendered = await renderSummaryFeedItem(event);
      });

      it('displays a generic article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('an article'));
      });

      it('displays the word "endorsed"', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('endorsed'));
      });

      it('displays the actor name', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('dummyActorName'));
      });

      it('displays the event date', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('Jan 1, 2020'));
      });
    });
  });

  describe('when given an EditorialCommunityReviewedArticleEvent', () => {
    const event: EditorialCommunityReviewedArticleEvent = {
      type: 'EditorialCommunityReviewedArticle',
      date: new Date('2020-01-01'),
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
        const renderSummaryFeedItem = createRenderSummaryFeedItem(dummyGetActor, getArticle);
        rendered = await renderSummaryFeedItem(event);
      });

      it('displays the article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining(articleTitle));
      });

      it('displays the word "reviewed"', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('reviewed'));
      });

      it('displays the actor name', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('dummyActorName'));
      });

      it('displays the event date', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('Jan 1, 2020'));
      });
    });

    describe('and the article information cannot be retrieved', () => {
      beforeEach(async () => {
        const getArticle: GetArticle = async () => Result.err('something-bad');
        const renderSummaryFeedItem = createRenderSummaryFeedItem(dummyGetActor, getArticle);
        rendered = await renderSummaryFeedItem(event);
      });

      it('displays a generic article title', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('an article'));
      });

      it('displays the word "reviewed"', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('reviewed'));
      });

      it('displays the actor name', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('dummyActorName'));
      });

      it('displays the event date', async () => {
        expect(rendered).toStrictEqual(expect.stringContaining('Jan 1, 2020'));
      });
    });
  });
});
