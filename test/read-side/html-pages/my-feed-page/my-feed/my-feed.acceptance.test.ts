import { load } from 'cheerio';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { myFeed, Dependencies } from '../../../../../src/read-side/html-pages/my-feed-page/my-feed';
import {
  feedTitle,
  followSomething,
  noEvaluationsYet,
  troubleFetchingTryAgain,
} from '../../../../../src/read-side/html-pages/my-feed-page/my-feed/static-content';
import * as DE from '../../../../../src/types/data-error';
import { toHtmlFragment } from '../../../../../src/types/html-fragment';
import { sanitise } from '../../../../../src/types/sanitised-html-fragment';
import { RecordEvaluationPublicationCommand } from '../../../../../src/write-side/commands';
import { TestFramework, createTestFramework } from '../../../../framework';
import { arbitrarySanitisedHtmlFragment } from '../../../../helpers';
import { arbitraryUserId } from '../../../../types/user-id.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../../write-side/commands/record-evaluation-publication-command.helper';

describe('my-feed acceptance', () => {
  let framework: TestFramework;
  let defaultDependencies: Dependencies;

  beforeEach(() => {
    framework = createTestFramework();
    defaultDependencies = {
      ...framework.dependenciesForViews,
      getAllEvents: framework.getAllEvents,
    };
  });

  it('displays the feed title', async () => {
    const html = await myFeed(defaultDependencies)(arbitraryUserId(), 20, 1)();

    expect(html).toContain(feedTitle);
  });

  describe('when there is a logged in user', () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
    });

    describe('following groups that have no evaluations', () => {
      const addGroupCommand = arbitraryAddGroupCommand();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroupCommand);
        await framework.commandHelpers.followGroup(
          { userId: createUserAccountCommand.userId, groupId: addGroupCommand.groupId },
        );
      });

      it('displays the calls to action to follow other groups or return later', async () => {
        const html = await myFeed(defaultDependencies)(createUserAccountCommand.userId, 20, 1)();

        expect(html).toContain(noEvaluationsYet);
      });
    });

    // Your feed is empty! Start following some groups to see their most recent evaluations right here.
    describe('not following any groups', () => {
      it('displays call to action to follow groups', async () => {
        const html = await myFeed(defaultDependencies)(createUserAccountCommand.userId, 20, 1)();

        expect(html).toContain(followSomething);
      });
    });

    describe('following groups with evaluations', () => {
      const addGroupCommand = arbitraryAddGroupCommand();

      beforeEach(async () => {
        await framework.commandHelpers.addGroup(addGroupCommand);
      });

      it('displays content in the form of article cards', async () => {
        const command = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
        };
        await framework.commandHelpers.followGroup(
          { userId: createUserAccountCommand.userId, groupId: addGroupCommand.groupId },
        );
        await framework.commandHelpers.recordEvaluationPublication(command);
        const html = await myFeed(defaultDependencies)(createUserAccountCommand.userId, 20, 1)();

        expect(html).toContain('class="article-card"');
      });

      it('renders at most a page of cards at a time', async () => {
        const recordEvaluation1 = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
        };
        const recordEvaluation2 = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
        };
        const recordEvaluation3 = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
        };
        await framework.commandHelpers.followGroup(
          { userId: createUserAccountCommand.userId, groupId: addGroupCommand.groupId },
        );
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluation1);
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluation2);
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluation3);
        const pageSize = 2;
        const renderedComponent = await myFeed(defaultDependencies)(createUserAccountCommand.userId, pageSize, 1)();
        const html = load(renderedComponent);
        const itemCount = html('.article-card').length;

        expect(itemCount).toStrictEqual(pageSize);
      });

      it('displayed articles have to have been evaluated by a followed group', async () => {
        const recordEvaluation = {
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
        };
        await framework.commandHelpers.followGroup(
          { userId: createUserAccountCommand.userId, groupId: addGroupCommand.groupId },
        );
        await framework.commandHelpers.recordEvaluationPublication(recordEvaluation);
        const dependencies = {
          ...defaultDependencies,
          fetchExpressionFrontMatter: () => TE.right({
            title: sanitise(toHtmlFragment('My article title')),
            authors: O.none,
            server: 'biorxiv' as const,
            abstract: O.some(arbitrarySanitisedHtmlFragment()),
          }),
        };
        const html = await myFeed(dependencies)(createUserAccountCommand.userId, 20, 1)();

        expect(html).toContain('My article title');
      });

      describe('when details of all articles cannot be fetched', () => {
        it('display only an error message', async () => {
          const recordEvaluation: RecordEvaluationPublicationCommand = {
            ...arbitraryRecordEvaluationPublicationCommand(),
            groupId: addGroupCommand.groupId,
          };
          await framework.commandHelpers.followGroup(
            { userId: createUserAccountCommand.userId, groupId: addGroupCommand.groupId },
          );
          await framework.commandHelpers.recordEvaluationPublication(recordEvaluation);
          const dependencies = {
            ...defaultDependencies,
            fetchExpressionFrontMatter: () => TE.left(DE.unavailable),
          };
          const html = await myFeed(dependencies)(createUserAccountCommand.userId, 20, 1)();

          expect(html).toContain(troubleFetchingTryAgain);
        });
      });
    });
  });
});
