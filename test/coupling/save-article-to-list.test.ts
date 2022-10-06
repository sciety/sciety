import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { isUserSavedArticleEvent, RuntimeGeneratedEvent, UserSavedArticleEvent } from '../../src/domain-events';
import { createListCommandHandler } from '../../src/lists';
import { executePolicies } from '../../src/policies/execute-policies';
import { executeSaveArticle } from '../../src/save-article/finish-save-article-command';
import { generateViewModel } from '../../src/sciety-feed-page/sciety-feed-page';
import { generateSearchResults } from '../../src/search-results-page/search-results-page';
import { Doi } from '../../src/types/doi';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { getUserListDetails, UserListDetails } from '../../src/user-page/user-list-card/get-user-list-details';
import {
  arbitraryDate, arbitraryNumber, arbitrarySanitisedHtmlFragment, arbitraryString, arbitraryUri,
  arbitraryWord,
} from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

// eslint-disable-next-line jest/require-hook
let events: ReadonlyArray<RuntimeGeneratedEvent> = [];

const getAllEvents = async () => events;

const commitEvents = (eventsToCommit: ReadonlyArray<RuntimeGeneratedEvent>) => {
  events = events.concat(eventsToCommit);
  return pipe(
    T.of(eventsToCommit),
    T.map(RA.match(
      () => 'no-events-created',
      () => 'events-created',
    )),
    T.chainFirst(() => pipe(
      eventsToCommit,
      T.traverseArray(executePolicies({
        commitEvents,
        getAllEvents,
        logger: () => {},
        getBiorxivOrMedrxivSubjectArea: () => TE.right(arbitraryString()),
        getListsOwnedBy: () => TE.right([{
          id: arbitraryListId(),
          name: arbitraryString(),
          description: arbitraryString(),
          articleCount: arbitraryNumber(1, 10),
          lastUpdated: arbitraryDate(),
          ownerId: arbitraryListOwnerId(),
        }]),
        getUserDetails: () => TE.right({
          avatarUrl: arbitraryUri(),
          displayName: arbitraryString(),
          handle: arbitraryWord(),
          userId: arbitraryUserId(),
        }),
        addArticleToList: () => TE.right(undefined),
        createList: createListCommandHandler({ commitEvents }),
      })),
    )),
  );
};

const nullAdapters = {
  commitEvents,
  getAllEvents,
  fetchStaticFile: () => TE.right(arbitraryString()),
  findVersionsForArticleDoi: () => TO.none,
  getListsOwnedBy: () => TE.right([]),
  fetchArticle: (doi: Doi) => TE.right({
    doi,
    title: toHtmlFragment(arbitraryString()),
    authors: O.none,
  }),
};

const searchHit = (articleId: Doi) => ({
  articleId,
  server: 'biorxiv' as const,
  title: arbitrarySanitisedHtmlFragment(),
  authors: O.none,
});

describe('save-article-to-list', () => {
  describe('given the user is logged in', () => {
    describe('and the user only has an empty default user list', () => {
      const articleId = arbitraryArticleId();
      const user = {
        id: arbitraryUserId(),
        handle: arbitraryWord(),
        avatarUrl: arbitraryUri(),
      };

      describe('when the user saves an article that isn\'t in any list', () => {
        beforeEach(async () => {
          await executeSaveArticle(nullAdapters)(user, articleId)();
        });

        it('the user\'s action appears in the Sciety feed', async () => {
          const adapters = {
            ...nullAdapters,
            getUserDetails: () => TE.right(user),
          };
          const viewModel = await pipe(
            { page: 1 },
            generateViewModel(adapters)(20),
            TE.getOrElse(shouldNotBeCalled),
          )();

          expect(viewModel.items).toHaveLength(1);
          expect(isUserSavedArticleEvent(viewModel.items[0])).toBeTruthy();

          const event = viewModel.items[0] as UserSavedArticleEvent;

          expect(event.userId).toBe(user.id);
          expect(event.articleId.value).toBe(articleId.value);
        });

        describe('the list card on the user profile page', () => {
          let card: UserListDetails;

          beforeEach(async () => {
            card = await pipe(
              getAllEvents,
              T.map(getUserListDetails(user.id)),
            )();
          });

          it('shows an incremented article count', async () => {
            expect(card.articleCount).toBe(1);
          });

          it('shows that the list has recently been updated', async () => {
            expect(O.isSome(card.lastUpdated)).toBeTruthy();
          });
        });

        it('the list count of the article card on the search page increases by one', async () => {
          const adapters = {
            ...nullAdapters,
            searchEuropePmc: () => () => TE.right({
              items: [searchHit(articleId)],
              total: 1,
              nextCursor: O.none,
            }),
          };
          const params = {
            query: articleId.toString(),
            category: O.some('articles' as const),
            cursor: O.none,
            page: O.none,
            evaluatedOnly: O.none,
          };
          const results = await pipe(
            params,
            generateSearchResults(adapters)(20),
            TE.getOrElse(shouldNotBeCalled),
          )();

          expect(results.itemsToDisplay).toHaveLength(1);
        });
      });
    });
  });
});
