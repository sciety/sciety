import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { JSDOM } from 'jsdom';
import {
  followSomething, noEvaluationsYet, troubleFetchingTryAgain, welcomeMessage,
} from '../../../src/home-page/your-feed/static-messages';
import { feedTitle, yourFeed } from '../../../src/home-page/your-feed/your-feed';
import { Doi, eqDoi } from '../../../src/types/doi';
import { editorialCommunityReviewedArticle, userFollowedEditorialCommunity } from '../../../src/types/domain-events';
import { toHtmlFragment } from '../../../src/types/html-fragment';
import { sanitise } from '../../../src/types/sanitised-html-fragment';
import { toUserId } from '../../../src/types/user-id';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryGroupId } from '../../types/group-id.helper';

describe('your-feed acceptance', () => {
  it('displays the feed title', async () => {
    const html = await yourFeed({
      fetchArticle: shouldNotBeCalled,
      findVersionsForArticleDoi: shouldNotBeCalled,
      getAllEvents: shouldNotBeCalled,
    })(O.none)();

    expect(html).toContain(feedTitle);
  });

  describe('there is no logged in user', () => {
    it('displays a welcome message', async () => {
      const html = await yourFeed({
        fetchArticle: shouldNotBeCalled,
        findVersionsForArticleDoi: shouldNotBeCalled,
        getAllEvents: shouldNotBeCalled,
      })(O.none)();

      expect(html).toContain(welcomeMessage);
    });
  });

  describe('there is a logged in user', () => {
    const userId = toUserId('alice');

    describe('following groups that have no evaluations', () => {
      it('displays the calls to action to follow other groups or return later', async () => {
        const adapters = {
          fetchArticle: shouldNotBeCalled,
          findVersionsForArticleDoi: shouldNotBeCalled,
          getAllEvents: T.of([userFollowedEditorialCommunity(userId, arbitraryGroupId())]),
        };

        const html = await yourFeed(adapters)(O.some(userId))();

        expect(html).toContain(noEvaluationsYet);
      });
    });

    // Your feed is empty! Start following some groups to see their most recent evaluations right here.
    describe('not following any groups', () => {
      it('displays call to action to follow groups', async () => {
        const adapters = {
          fetchArticle: shouldNotBeCalled,
          findVersionsForArticleDoi: shouldNotBeCalled,
          getAllEvents: T.of([]),
        };
        const html = await yourFeed(adapters)(O.some(userId))();

        expect(html).toContain(followSomething);
      });
    });

    describe('following groups with evaluations', () => {
      const arbitraryVersions = () => TO.some([
        {
          occurredAt: new Date(),
        },
      ] as RNEA.ReadonlyNonEmptyArray<{ occurredAt: Date }>);

      it('displays content in the form of article cards', async () => {
        const groupId = arbitraryGroupId();
        const adapters = {
          fetchArticle: () => TE.right({
            title: sanitise(toHtmlFragment('My article title')),
            authors: [],
            server: 'biorxiv' as const,
          }),
          findVersionsForArticleDoi: arbitraryVersions,
          getAllEvents: T.of([
            userFollowedEditorialCommunity(userId, groupId),
            editorialCommunityReviewedArticle(groupId, new Doi('10.1101/111111'), new Doi('10.1101/222222')),
          ]),
        };
        const html = await yourFeed(adapters)(O.some(userId))();

        expect(html).toContain('class="article-card"');
      });

      /*
      Not implementing, pending further discussion on testing architecture
      */
      it.todo('display a maximum of 20 articles');

      it.todo('displays the articles in order of latest activity in descending order');

      it.todo('latest activity is based off of activity by any group');

      it.todo('each article is only displayed once');

      it('displayed articles have to have been evaluated by a followed group', async () => {
        const groupId = arbitraryGroupId();
        const adapters = {
          fetchArticle: () => TE.right({
            title: sanitise(toHtmlFragment('My article title')),
            authors: [],
            server: 'biorxiv' as const,
          }),
          findVersionsForArticleDoi: arbitraryVersions,
          getAllEvents: T.of([
            userFollowedEditorialCommunity(userId, groupId),
            editorialCommunityReviewedArticle(groupId, new Doi('10.1101/111111'), new Doi('10.1101/222222')),
          ]),
        };
        const html = await yourFeed(adapters)(O.some(userId))();

        expect(html).toContain('My article title');
      });

      describe('when details of an article cannot be fetched', () => {
        it('only displays the successfully fetched articles', async () => {
          const groupId = arbitraryGroupId();
          const failingDoi = new Doi('10.1101/failing');
          const adapters = {
            fetchArticle: (doi: Doi) => (
              eqDoi.equals(doi, failingDoi)
                ? TE.left('unavailable' as const)
                : TE.right({
                  title: sanitise(toHtmlFragment('My article title')),
                  authors: [],
                  server: 'biorxiv' as const,
                })),
            findVersionsForArticleDoi: arbitraryVersions,
            getAllEvents: T.of([
              userFollowedEditorialCommunity(userId, groupId),
              editorialCommunityReviewedArticle(groupId, failingDoi, new Doi('10.1101/111111')),
              editorialCommunityReviewedArticle(groupId, new Doi('10.1101/success'), new Doi('10.1101/222222')),
            ]),
          };

          const html = await yourFeed(adapters)(O.some(userId))();
          const fragment = JSDOM.fragment(html);
          const cards = Array.from(fragment.querySelectorAll('.article-card'));

          expect(cards).toHaveLength(1);
        });
      });

      describe('when details of all articles cannot be fetched', () => {
        it('display only an error message', async () => {
          const groupId = arbitraryGroupId();
          const adapters = {
            fetchArticle: () => TE.left('unavailable' as const),
            findVersionsForArticleDoi: shouldNotBeCalled,
            getAllEvents: T.of([
              userFollowedEditorialCommunity(userId, groupId),
              editorialCommunityReviewedArticle(groupId, new Doi('10.1101/111111'), new Doi('10.1101/222222')),
            ]),
          };
          const html = await yourFeed(adapters)(O.some(userId))();

          expect(html).toContain(troubleFetchingTryAgain);
        });
      });
    });
  });
});
