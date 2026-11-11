import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { List } from '../../../../../src/read-models/lists';
import { constructViewModel } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model';
import { LoggedInUserListManagement, ViewModel } from '../../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { AtprotoMention } from '../../../../../src/types/atproto-mention';
import * as DE from '../../../../../src/types/data-error';
import * as LOID from '../../../../../src/types/list-owner-id';
import { CreateListCommand, CreateUserAccountCommand } from '../../../../../src/write-side/commands';
import { abortTest } from '../../../../abort-test';
import { createTestFramework, TestFramework } from '../../../../framework';
import {
  arbitraryDate, arbitraryString, arbitraryUri, arbitraryWord,
} from '../../../../helpers';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryDataError } from '../../../../types/data-error.helper';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

const arbitraryAtprotoMention = (): AtprotoMention => ({
  atUri: `at://did:plc:${arbitraryWord()}/app.bsky.feed.post/${arbitraryWord()}`,
  source: 'Bluesky',
  authorHandle: arbitraryWord(),
  text: arbitraryString(),
  href: arbitraryUri(),
  createdAt: arbitraryDate(),
});

describe('construct-view-model', () => {
  let framework: TestFramework;
  const expressionDoi = arbitraryExpressionDoi();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when no paper expressions can be found', () => {
    let viewModel: E.Either<unknown, ViewModel>;

    beforeEach(async () => {
      viewModel = await pipe(
        {
          latestExpressionDoi: arbitraryExpressionDoi(),
          user: O.none,
        },
        constructViewModel({
          ...framework.dependenciesForViews,
          fetchPublishingHistory: () => TE.left(DE.notFound),
        }),
      )();
    });

    it('returns on the left', () => {
      expect(E.isLeft(viewModel)).toBe(true);
    });
  });

  describe('when the paper has no Semble cards', () => {
    const paperExpressionDoi = arbitraryExpressionDoi();

    describe('and there are mentions', () => {
      const mention = arbitraryAtprotoMention();
      let feedItems: ViewModel['feedItemsByDateDescending'];
      let requestedSources: ReadonlyArray<AtprotoMention['source']>;

      beforeEach(async () => {
        feedItems = await pipe(
          {
            latestExpressionDoi: paperExpressionDoi,
            user: O.none,
          },
          constructViewModel({
            ...framework.dependenciesForViews,
            fetchAtprotoMentions: (_history, sources) => {
              requestedSources = sources;
              return TE.right([mention]);
            },
          }),
          TE.map((viewModel) => viewModel.feedItemsByDateDescending),
          TE.getOrElse(abortTest('constructViewModel unexpectedly is on the left')),
        )();
      });

      it('only requests mentions from Bluesky', () => {
        expect(requestedSources).toStrictEqual(['Bluesky']);
      });

      it('includes the mentions in the feed', () => {
        expect(feedItems).toContainEqual({
          type: 'atproto-mention-published',
          publishedAt: mention.createdAt,
          source: mention.source,
          authorHandle: mention.authorHandle,
          text: mention.text,
          href: mention.href,
        });
      });
    });

    describe('and the mentions cannot be fetched', () => {
      let viewModel: E.Either<unknown, ViewModel>;

      beforeEach(async () => {
        viewModel = await pipe(
          {
            latestExpressionDoi: paperExpressionDoi,
            user: O.none,
          },
          constructViewModel({
            ...framework.dependenciesForViews,
            fetchAtprotoMentions: () => TE.left(arbitraryDataError()),
          }),
        )();
      });

      it('returns on the right', () => {
        expect(E.isRight(viewModel)).toBe(true);
      });

      it('does not include any mentions in the feed', () => {
        expect(pipe(
          viewModel,
          E.map((v) => v.feedItemsByDateDescending.filter((item) => item.type === 'atproto-mention-published')),
        )).toStrictEqual(E.right([]));
      });
    });
  });

  describe('when the paper has Semble cards', () => {
    const sembleCardUrl = arbitraryUri();
    let requestedSources: ReadonlyArray<AtprotoMention['source']>;
    let requestedAdditionalSembleUrls: ReadonlyArray<string>;

    beforeEach(async () => {
      await pipe(
        {
          latestExpressionDoi: arbitraryExpressionDoi(),
          user: O.none,
        },
        constructViewModel({
          ...framework.dependenciesForViews,
          fetchSembleCardUrls: () => TE.right([sembleCardUrl]),
          fetchAtprotoMentions: (_history, sources, additionalSembleUrls) => {
            requestedSources = sources;
            requestedAdditionalSembleUrls = additionalSembleUrls;
            return TE.right([]);
          },
        }),
        TE.getOrElse(abortTest('constructViewModel unexpectedly is on the left')),
      )();
    });

    it('requests mentions from Bluesky and Semble', () => {
      expect(requestedSources).toStrictEqual(['Bluesky', 'Semble']);
    });

    it('requests Semble mentions for the urls of the cards', () => {
      expect(requestedAdditionalSembleUrls).toStrictEqual([sembleCardUrl]);
    });
  });

  describe('when the Semble cards cannot be fetched', () => {
    let viewModel: E.Either<unknown, ViewModel>;
    let requestedSources: ReadonlyArray<AtprotoMention['source']>;

    beforeEach(async () => {
      viewModel = await pipe(
        {
          latestExpressionDoi: arbitraryExpressionDoi(),
          user: O.none,
        },
        constructViewModel({
          ...framework.dependenciesForViews,
          fetchSembleCardUrls: () => TE.left(arbitraryDataError()),
          fetchAtprotoMentions: (_history, sources) => {
            requestedSources = sources;
            return TE.right([]);
          },
        }),
      )();
    });

    it('returns on the right', () => {
      expect(E.isRight(viewModel)).toBe(true);
    });

    it('still requests mentions from Bluesky', () => {
      expect(requestedSources).toStrictEqual(['Bluesky']);
    });
  });

  describe('when the user is logged in', () => {
    let createUserAccountCommand: CreateUserAccountCommand;

    beforeEach(async () => {
      createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
    });

    describe('when the article is not saved to any of the user\'s multiple lists', () => {
      let createListCommand: CreateListCommand;
      let saveArticleCta: (LoggedInUserListManagement & { '_tag': 'Left' })['left'];

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        saveArticleCta = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(abortTest('constructViewModel unexpectedly is on the left')),
          TE.match(identity, abortTest('LoggedInUserListManagement is unexpectedly on the right')),
        )();
      });

      it('displays save this article call to action', () => {
        expect(saveArticleCta.saveArticleHref).toStrictEqual(expect.anything());
      });
    });

    describe('when the article is saved to the default user list', () => {
      let list: List;
      let containingList: (LoggedInUserListManagement & { '_tag': 'Right' })['right'];

      beforeEach(async () => {
        list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
        await framework.commandHelpers.addArticleToList({ expressionDoi, listId: list.id });
        containingList = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
          TE.getOrElse(abortTest('LoggedInUserListManagement is unexpectedly on the left')),
        )();
      });

      it('list management has access to list id', async () => {
        expect(containingList.listId).toStrictEqual(list.id);
      });

      it('list management has access to list name', () => {
        expect(containingList.listName).toStrictEqual(list.name);
      });
    });

    describe('when the article is saved to another user list', () => {
      let createListCommand: CreateListCommand;
      let containingList: (LoggedInUserListManagement & { '_tag': 'Right' })['right'];

      beforeEach(async () => {
        createListCommand = {
          ...arbitraryCreateListCommand(),
          ownerId: LOID.fromUserId(createUserAccountCommand.userId),
        };
        await framework.commandHelpers.createList(createListCommand);
        await framework.commandHelpers.addArticleToList(
          { expressionDoi, listId: createListCommand.listId },
        );
        containingList = await pipe(
          {
            latestExpressionDoi: expressionDoi,
            user: O.some({ id: createUserAccountCommand.userId }),
          },
          constructViewModel(framework.dependenciesForViews),
          TE.map((v) => v.userListManagement),
          TE.map(O.getOrElseW(shouldNotBeCalled)),
          TE.getOrElse(shouldNotBeCalled),
          TE.getOrElse(abortTest('LoggedInUserListManagement is unexpectedly on the left')),
        )();
      });

      it('list management has access to list id', () => {
        expect(containingList.listId).toStrictEqual(createListCommand.listId);
      });

      it('list management has access to list name', () => {
        expect(containingList.listName).toStrictEqual(createListCommand.name);
      });
    });
  });
});
