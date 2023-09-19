import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { JSDOM } from 'jsdom';
import { myFeed, Dependencies } from '../../../../src/html-pages/my-feed-page/my-feed';
import {
  feedTitle,
  followSomething,
  noEvaluationsYet,
  troubleFetchingTryAgain,
} from '../../../../src/html-pages/my-feed-page/my-feed/static-content';
import * as DE from '../../../../src/types/data-error';
import { toHtmlFragment } from '../../../../src/types/html-fragment';
import { sanitise } from '../../../../src/types/sanitised-html-fragment';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryGroup } from '../../../types/group.helper';
import { RecordedEvaluation } from '../../../../src/types/recorded-evaluation';
import { arbitraryRecordedEvaluation } from '../../../types/recorded-evaluation.helper';
import { arbitrarySanitisedHtmlFragment } from '../../../helpers';
import { arbitraryDoi } from '../../../types/doi.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

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
      const group = arbitraryGroup();

      beforeEach(async () => {
        await framework.commandHelpers.deprecatedCreateGroup(group);
        await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group.id);
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
      const group = arbitraryGroup();

      beforeEach(async () => {
        await framework.commandHelpers.deprecatedCreateGroup(group);
      });

      it('displays content in the form of article cards', async () => {
        const evaluation: RecordedEvaluation = { ...arbitraryRecordedEvaluation(), groupId: group.id };
        await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group.id);
        await framework.commandHelpers.recordEvaluationPublication(evaluation);
        const html = await myFeed(defaultDependencies)(createUserAccountCommand.userId, 20, 1)();

        expect(html).toContain('class="article-card"');
      });

      it('renders at most a page of cards at a time', async () => {
        const evaluation1: RecordedEvaluation = { ...arbitraryRecordedEvaluation(), groupId: group.id };
        const evaluation2: RecordedEvaluation = { ...arbitraryRecordedEvaluation(), groupId: group.id };
        const evaluation3: RecordedEvaluation = { ...arbitraryRecordedEvaluation(), groupId: group.id };
        await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group.id);
        await framework.commandHelpers.recordEvaluationPublication(evaluation1);
        await framework.commandHelpers.recordEvaluationPublication(evaluation2);
        await framework.commandHelpers.recordEvaluationPublication(evaluation3);
        const pageSize = 2;
        const renderedComponent = await myFeed(defaultDependencies)(createUserAccountCommand.userId, pageSize, 1)();
        const html = JSDOM.fragment(renderedComponent);
        const itemCount = Array.from(html.querySelectorAll('.article-card')).length;

        expect(itemCount).toStrictEqual(pageSize);
      });

      it.todo('displays the articles in order of latest activity in descending order');

      it.todo('latest activity is based off of activity by any group');

      it.todo('each article is only displayed once');

      it('displayed articles have to have been evaluated by a followed group', async () => {
        const evaluation: RecordedEvaluation = { ...arbitraryRecordedEvaluation(), groupId: group.id };
        await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group.id);
        await framework.commandHelpers.recordEvaluationPublication(evaluation);
        const dependencies = {
          ...defaultDependencies,
          fetchArticle: () => TE.right({
            title: sanitise(toHtmlFragment('My article title')),
            authors: O.none,
            server: 'biorxiv' as const,
            abstract: arbitrarySanitisedHtmlFragment(),
            doi: arbitraryDoi(),
          }),
        };
        const html = await myFeed(dependencies)(createUserAccountCommand.userId, 20, 1)();

        expect(html).toContain('My article title');
      });

      describe('when details of all articles cannot be fetched', () => {
        it('display only an error message', async () => {
          const evaluation: RecordedEvaluation = { ...arbitraryRecordedEvaluation(), groupId: group.id };
          await framework.commandHelpers.followGroup(createUserAccountCommand.userId, group.id);
          await framework.commandHelpers.recordEvaluationPublication(evaluation);
          const dependencies = {
            ...defaultDependencies,
            fetchArticle: () => TE.left(DE.unavailable),
          };
          const html = await myFeed(dependencies)(createUserAccountCommand.userId, 20, 1)();

          expect(html).toContain(troubleFetchingTryAgain);
        });
      });
    });
  });
});
