import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { constructViewModel } from '../../../src/html-pages/create-annotation-form-page/construct-view-model';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryArticleId } from '../../types/article-id.helper';
import * as DE from '../../../src/types/data-error';
import { ViewModel } from '../../../src/html-pages/create-annotation-form-page/view-model';
import { arbitrarySanitisedHtmlFragment } from '../../helpers';
import { arbitraryCreateUserAccountCommand } from '../../write-side/commands/create-user-account-command.helper';
import * as LOID from '../../../src/types/list-owner-id';
import { List } from '../../../src/types/list';
import { arbitraryListId } from '../../types/list-id.helper';
import { arbitraryArticleDetails } from '../../third-parties/external-queries.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: E.Either<unknown, ViewModel>;
  const setUpAUserList = async () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();
    await framework.commandHelpers.createUserAccount(createUserAccountCommand);
    return framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
  };

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when the article title is available and the list exists', () => {
    let viewModel: ViewModel;
    let userList: List;
    const title = arbitrarySanitisedHtmlFragment();

    beforeEach(async () => {
      userList = await setUpAUserList();
      viewModel = await pipe(
        constructViewModel(
          arbitraryArticleId(),
          userList.id,
          {
            ...framework.dependenciesForViews,
            fetchPaperExpressionFrontMatter: () => TE.right({
              ...arbitraryArticleDetails(),
              title,
            }),
          },
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains the article title', () => {
      expect(viewModel.articleTitle).toStrictEqual(title);
    });

    it('contains the list name', () => {
      expect(viewModel.listName).toStrictEqual(userList.name);
    });
  });

  describe('when the article title is not available', () => {
    beforeEach(async () => {
      const userList = await setUpAUserList();
      result = await constructViewModel(
        arbitraryArticleId(),
        userList.id,
        {
          ...framework.dependenciesForViews,
          fetchPaperExpressionFrontMatter: () => TE.left(DE.notFound),
        },
      )();
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });

  describe('when the list does not exist', () => {
    beforeEach(async () => {
      result = await pipe(
        constructViewModel(
          arbitraryArticleId(),
          arbitraryListId(),
          framework.dependenciesForViews,
        ),
      )();
    });

    it('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });
});
