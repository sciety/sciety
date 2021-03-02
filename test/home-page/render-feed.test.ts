import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import {
  GetEvents,
  IsFollowingSomething,
  renderFeed,
} from '../../src/home-page/render-feed';
import { Doi } from '../../src/types/doi';
import {
  editorialCommunityReviewedArticle,
  EditorialCommunityReviewedArticleEvent,
} from '../../src/types/domain-events';
import { GroupId } from '../../src/types/editorial-community-id';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { toReviewId } from '../../src/types/review-id';
import { toUserId } from '../../src/types/user-id';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('render-feed', () => {
  describe('when the user is logged in', () => {
    describe('and has a non-empty feed', () => {
      it('returns a list', async () => {
        const dummyGetEvents: GetEvents<EditorialCommunityReviewedArticleEvent> = () => T.of([
          editorialCommunityReviewedArticle(
            new GroupId('our-community'),
            new Doi('10.1101/111111'),
            toReviewId('doi:10.1101/222222'),
          ),
        ]);
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(true);
        const dummyRenderSummaryFeedList = () => T.of(O.some(toHtmlFragment('someNiceList')));
        const render = renderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          dummyRenderSummaryFeedList,
        );
        const rendered = await render(O.some(toUserId('1111')))();

        expect(rendered).toStrictEqual(expect.stringContaining('someNiceList'));
      });
    });

    describe('and has an empty feed', () => {
      it('returns a come back later text', async () => {
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(true);
        const dummyGetEvents: GetEvents<EditorialCommunityReviewedArticleEvent> = () => T.of([]);
        const stubRenderSummaryFeedList = () => T.of(O.none);
        const render = renderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          stubRenderSummaryFeedList,
        );
        const rendered = await render(O.some(toUserId('1111')))();

        expect(rendered).toContain('The groups you’re following haven’t evaluated any articles yet.');
      });
    });

    describe('and is not following anything yet', () => {
      it('returns a follow-something text', async () => {
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(false);
        const render = renderFeed(
          dummyIsFollowingSomething,
          shouldNotBeCalled,
          shouldNotBeCalled,
        );
        const rendered = await render(O.some(toUserId('1111')))();

        expect(rendered).toContain('Start following some groups');
      });
    });
  });

  describe('when the user is not logged in', () => {
    it('invites them to log in', async () => {
      const render = renderFeed(
        shouldNotBeCalled,
        shouldNotBeCalled,
        shouldNotBeCalled,
      );
      const rendered = await render(O.none)();

      expect(rendered).toContain('Log in');
    });
  });
});
