import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constructFeedItem, GetArticle } from '../../../src/home-page/your-feed/construct-feed-item';
import { Doi } from '../../../src/types/doi';
import { EditorialCommunityReviewedArticleEvent } from '../../../src/types/domain-events';
import { GroupId } from '../../../src/types/group-id';
import { SanitisedHtmlFragment } from '../../../src/types/sanitised-html-fragment';

describe('construct-feed-item', () => {
  const articleTitle = 'the title' as SanitisedHtmlFragment;
  const arbitraryActorId = new GroupId('1234');
  const arbitraryArticleId = new Doi('10.5281/zenodo.3678326');
  const dummyGetActor = () => T.of({
    url: '',
    name: 'dummyActorName',
    imageUrl: '',
  });

  describe('when given an EditorialCommunityReviewedArticleEvent', () => {
    const event: EditorialCommunityReviewedArticleEvent = {
      type: 'EditorialCommunityReviewedArticle',
      date: new Date('2020-01-01'),
      editorialCommunityId: arbitraryActorId,
      articleId: arbitraryArticleId,
      reviewId: new Doi('10.1234/5678'),
    };

    describe('and the article information can be retrieved', () => {
      const getArticle: GetArticle = () => TE.right({
        title: articleTitle,
      });

      it('displays the article title', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ title: articleTitle }));
      });

      it('displays the word "reviewed"', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ verb: 'reviewed' }));
      });

      it('displays the actor name', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ actorName: 'dummyActorName' }));
      });

      it('displays the event date', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ date: new Date('2020-01-01') }));
      });
    });

    describe('and the article information cannot be retrieved', () => {
      const getArticle: GetArticle = () => TE.left('something-bad');

      it('displays a generic article title', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ title: 'an article' }));
      });

      it('displays the word "reviewed"', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ verb: 'reviewed' }));
      });

      it('displays the actor name', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ actorName: 'dummyActorName' }));
      });

      it('displays the event date', async () => {
        const feedItem = await constructFeedItem(dummyGetActor, getArticle)(event)();

        expect(feedItem).toStrictEqual(expect.objectContaining({ date: new Date('2020-01-01') }));
      });
    });
  });
});
