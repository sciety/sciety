import * as O from 'fp-ts/lib/Option';
import createRenderFeed, { GetEvents, IsFollowingSomething } from '../../src/home-page/render-feed';
import { RenderSummaryFeedList } from '../../src/shared-components/render-summary-feed-list';
import { toHtmlFragment } from '../../src/types/html-fragment';
import toUserId from '../../src/types/user-id';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-feed', (): void => {
  describe('when the user is logged in', () => {
    describe('and has a non-empty feed', () => {
      it('returns a list', async (): Promise<void> => {
        const dummyGetEvents: GetEvents<unknown> = async () => ['some-event'];
        const dummyIsFollowingSomething: IsFollowingSomething = async () => true;
        const dummyRenderSummaryFeedList: RenderSummaryFeedList<unknown> = async () => O.some(toHtmlFragment('someNiceList'));
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
        const dummyIsFollowingSomething: IsFollowingSomething = async () => true;
        const dummyGetEvents: GetEvents<unknown> = async () => [];
        const stubRenderSummaryFeedList: RenderSummaryFeedList<unknown> = async () => O.none;
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
        const dummyIsFollowingSomething: IsFollowingSomething = async () => false;
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
