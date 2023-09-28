import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { constructViewModel } from '../../../src/html-pages/create-annotation-form-page/construct-view-model';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import * as DE from '../../../src/types/data-error';
import { ViewModel } from '../../../src/html-pages/create-annotation-form-page/view-model';
import { ArticleDetails } from '../../../src/third-parties/external-queries';
import { arbitrarySanitisedHtmlFragment, arbitraryString } from '../../helpers';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { arbitraryCreateUserAccountCommand } from '../../write-side/commands/create-user-account-command.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { List } from '../../../src/types/list';

const arbitraryArticleDetails = (): ArticleDetails => ({
  abstract: arbitrarySanitisedHtmlFragment(),
  authors: O.some([arbitraryString()]),
  doi: arbitraryArticleId(),
  title: arbitrarySanitisedHtmlFragment(),
  server: arbitraryArticleServer(),
});

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: Awaited<ReturnType<ReturnType<typeof constructViewModel>>>;

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when the article title and list name are available', () => {
    let viewModel: ViewModel;
    let userList: List;
    const title = arbitrarySanitisedHtmlFragment();

    beforeEach(async () => {
      const createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      userList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      viewModel = await pipe(
        constructViewModel(
          arbitraryArticleId().value,
          arbitraryListId(),
          {
            ...framework.dependenciesForViews,
            fetchArticle: () => TE.right({
              ...arbitraryArticleDetails(),
              title,
            }),
          },
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the article title', () => {
      expect(viewModel.articleTitle).toStrictEqual(title);
    });

    it.failing('returns the list name', () => {
      expect(viewModel.listName).toStrictEqual(userList.name);
    });
  });

  describe('when the article title is not available', () => {
    beforeEach(async () => {
      const createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      const userList = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      result = await constructViewModel(
        arbitraryArticleId().value,
        userList.id,
        {
          ...framework.dependenciesForViews,
          fetchArticle: () => TE.left(DE.notFound),
        },
      )();
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });

  describe('when the list name is not available', () => {
    it.todo('returns on the left');
  });
});
