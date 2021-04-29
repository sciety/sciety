import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import {
  GetEvents,
  IsFollowingSomething,
  renderFeed,
} from '../../../src/home-page/your-feed/render-feed';
import { ArticleViewModel } from '../../../src/shared-components';
import { Doi } from '../../../src/types/doi';
import {
  editorialCommunityReviewedArticle,
  EditorialCommunityReviewedArticleEvent,
} from '../../../src/types/domain-events';
import { GroupId } from '../../../src/types/group-id';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { toReviewId } from '../../../src/types/review-id';
import { toUserId } from '../../../src/types/user-id';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('render-feed', () => {
  describe('when the user is logged in', () => {
    describe('and has a non-empty feed', () => {
      it('returns a list', async () => {
        const dummyGetEvents: GetEvents<EditorialCommunityReviewedArticleEvent> = () => T.of([
          editorialCommunityReviewedArticle(
            new GroupId('our-group'),
            new Doi('10.1101/111111'),
            toReviewId('doi:10.1101/222222'),
          ),
        ]);
        // TODO: should have at least one article view model
        const articleViewModels: ReadonlyArray<ArticleViewModel> = [];
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(true);
        const dummyRenderSummaryFeedList = () => T.of(toHtmlFragment('someNiceList'));
        const render = renderFeed(
          dummyIsFollowingSomething,
          dummyGetEvents,
          dummyRenderSummaryFeedList,
        );
        const rendered = await render(
          O.some(toUserId('1111')),
          articleViewModels,
        )();

        expect(rendered).toStrictEqual(expect.stringContaining('someNiceList'));
      });
    });

    describe('and is not following anything yet', () => {
      it('returns a follow-something text', async () => {
        const articleViewModels: ReadonlyArray<ArticleViewModel> = [];
        const dummyIsFollowingSomething: IsFollowingSomething = () => T.of(false);
        const render = renderFeed(
          dummyIsFollowingSomething,
          shouldNotBeCalled,
          shouldNotBeCalled,
        );
        const rendered = await render(
          O.some(toUserId('1111')),
          articleViewModels,
        )();

        expect(rendered).toContain('Start following some groups');
      });
    });
  });

  describe('when the user is not logged in', () => {
    it('invites them to log in', async () => {
      const articleViewModels: ReadonlyArray<ArticleViewModel> = [];
      const render = renderFeed(
        shouldNotBeCalled,
        shouldNotBeCalled,
        shouldNotBeCalled,
      );
      const rendered = await render(
        O.none,
        articleViewModels,
      )();

      expect(rendered).toContain('Log in');
    });
  });
});
