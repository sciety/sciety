import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RuntimeGeneratedEvent } from '../../src/domain-events';
import { createListCommandHandler } from '../../src/lists';
import { executePolicies } from '../../src/policies/execute-policies';
import { executeSaveArticle } from '../../src/save-article/finish-save-article-command';
import { generateViewModel } from '../../src/sciety-feed-page/sciety-feed-page';
import { toHtmlFragment } from '../../src/types/html-fragment';
import {
  arbitraryDate, arbitraryNumber, arbitraryString, arbitraryUri, arbitraryWord,
} from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryListId } from '../types/list-id.helper';
import { arbitraryListOwnerId } from '../types/list-owner-id.helper';
import { arbitraryUserId } from '../types/user-id.helper';

// eslint-disable-next-line jest/require-hook
let events: ReadonlyArray<RuntimeGeneratedEvent> = [];

const getAllEvents = T.of(events);

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

describe('save-article-to-list', () => {
  describe('given the user is logged in', () => {
    describe('and the user only has an empty default user list', () => {
      beforeAll(async () => {
        // await goto(`localhost:8080/log-in-as?userId=${testUserId}`);
      });

      describe('when the user saves an article that isn\'t in any list', () => {
        beforeEach(async () => {
          const ports = {
            getAllEvents,
            commitEvents,
          };
          const user = {
            id: arbitraryUserId(),
            handle: arbitraryWord(),
            avatarUrl: arbitraryUri(),
          };
          const articleId = arbitraryArticleId();
          await executeSaveArticle(ports)(user, articleId)();
        });

        it.failing('the user\'s action appears in the Sciety feed', async () => {
          const adapters = {
            getAllEvents,
            getUserDetails: () => TE.right({
              handle: arbitraryWord(),
              avatarUrl: arbitraryUri(),
            }),
            fetchArticle: () => TE.right({
              doi: arbitraryArticleId(),
              title: toHtmlFragment(arbitraryString()),
              authors: O.none,
            }),
          };
          const params = {
            page: 1,
          };
          const viewModel = await pipe(
            params,
            generateViewModel(adapters)(20),
            TE.getOrElse(shouldNotBeCalled),
          )();

          expect(viewModel.items).toHaveLength(1);
        });
      });
    });
  });
});
