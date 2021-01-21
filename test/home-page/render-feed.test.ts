import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import createRenderFeed, { GetEvents, IsFollowingSomething } from '../../src/home-page/render-feed';
import { FeedEvent } from '../../src/shared-components/construct-feed-item';
import { RenderSummaryFeedList } from '../../src/shared-components/render-summary-feed-list';
import { Doi } from '../../src/types/doi';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { EditorialCommunityId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { toReviewId } from '../../src/types/review-id';
import { toUserId } from '../../src/types/user-id';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('render-feed', (): void => {
  describe('when the user is logged in', () => {
    describe('and has a non-empty feed', () => {
      it('returns a list', async (): Promise<void> => {
        const dummyGetEvents: GetEvents<FeedEvent> = () => T.of([
          editorialCommunityReviewedArticle(
            new EditorialCommunityId('our-community'),
            new Doi('10.1101/111111'),
            toReviewId('doi:10.1101/222222'),
          ),
        ]);
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(true);
        const dummyRenderSummaryFeedList: RenderSummaryFeedList = () => T.of(O.some(toHtmlFragment('someNiceList')));
        const renderFeed = createRenderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          dummyRenderSummaryFeedList,
        );
        const rendered = await renderFeed(O.some(toUserId('1111')))();

        expect(rendered).toStrictEqual(expect.stringContaining('someNiceList'));
      });

      describe('when given three feed items', () => {
        it.todo('renders the three feed items supplied');
      });
    });

    describe('and has an empty feed', () => {
      it('returns a come back later text', async (): Promise<void> => {
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(true);
        const dummyGetEvents: GetEvents<FeedEvent> = () => T.of([]);
        const stubRenderSummaryFeedList: RenderSummaryFeedList = () => T.of(O.none);
        const renderFeed = createRenderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          stubRenderSummaryFeedList,
        );
        const rendered = await renderFeed(O.some(toUserId('1111')))();

        expect(rendered).toContain('The communities you’re following haven’t evaluated any articles yet.');
      });
    });

    describe('and is not following anything yet', () => {
      it('returns a follow-something text', async () => {
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(false);
        const renderFeed = createRenderFeed(
          dummyIsFollowingSomething,
          shouldNotBeCalled,
          shouldNotBeCalled,
        );
        const rendered = await renderFeed(O.some(toUserId('1111')))();

        expect(rendered).toContain('Start following some communities');
      });
    });
  });

  describe('when the user is not logged in', () => {
    it('invites them to log in', async () => {
      const renderFeed = createRenderFeed(
        shouldNotBeCalled,
        shouldNotBeCalled,
        shouldNotBeCalled,
      );
      const rendered = await renderFeed(O.none)();

      expect(rendered).toContain('Log in');
    });
  });
});
