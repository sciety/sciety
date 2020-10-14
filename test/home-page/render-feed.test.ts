import { Maybe } from 'true-myth';
import createRenderFeed, { GetEvents, IsFollowingSomething } from '../../src/home-page/render-feed';
import { RenderSummaryFeedList } from '../../src/templates/render-summary-feed-list';
import Doi from '../../src/types/doi';
import EditorialCommunityId from '../../src/types/editorial-community-id';
import toUserId from '../../src/types/user-id';
import shouldNotBeCalled from '../should-not-be-called';

describe('render-feed', (): void => {
  describe('when the user is logged in', () => {
    describe('and has a non-empty feed', () => {
      it('returns a list', async (): Promise<void> => {
        const dummyGetEvents: GetEvents = async () => [
          {
            type: 'EditorialCommunityEndorsedArticle',
            date: new Date(),
            editorialCommunityId: new EditorialCommunityId(''),
            articleId: new Doi('10.1101/12345678'),
          },
        ];
        const dummyIsFollowingSomething: IsFollowingSomething = async () => true;
        const dummyRenderSummaryFeedList: RenderSummaryFeedList = async () => 'someNiceList';
        const renderFeed = createRenderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          dummyRenderSummaryFeedList,
        );
        const rendered = await renderFeed(Maybe.just(toUserId('1111')));

        expect(rendered).toStrictEqual(expect.stringContaining('someNiceList'));
      });

      describe('when given three feed items', () => {
        it.todo('renders the three feed items supplied');
      });
    });

    describe('and has an empty feed', () => {
      it('returns a come back later text', async (): Promise<void> => {
        const dummyIsFollowingSomething: IsFollowingSomething = async () => true;
        const dummyGetEvents: GetEvents = async () => [];
        const renderFeed = createRenderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          shouldNotBeCalled,
        );
        const rendered = await renderFeed(Maybe.just(toUserId('1111')));

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
        const rendered = await renderFeed(Maybe.just(toUserId('1111')));

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
      const rendered = await renderFeed(Maybe.nothing());

      expect(rendered).toContain('Log in');
    });
  });
});
