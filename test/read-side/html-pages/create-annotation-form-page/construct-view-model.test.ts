import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../src/read-models/lists';
import { constructViewModel } from '../../../../src/read-side/html-pages/create-annotation-form-page/construct-view-model';
import { ViewModel } from '../../../../src/read-side/html-pages/create-annotation-form-page/view-model';
import { ArticleId } from '../../../../src/types/article-id';
import * as DE from '../../../../src/types/data-error';
import * as LOID from '../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitrarySanitisedHtmlFragment } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryArticleDetails } from '../../../third-parties/external-queries.helper';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryListId } from '../../../types/list-id.helper';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';

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
          new ArticleId(arbitraryExpressionDoi()),
          userList.id,
          {
            ...framework.dependenciesForViews,
            fetchExpressionFrontMatter: () => TE.right({
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
        new ArticleId(arbitraryExpressionDoi()),
        userList.id,
        {
          ...framework.dependenciesForViews,
          fetchExpressionFrontMatter: () => TE.left(DE.notFound),
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
          new ArticleId(arbitraryExpressionDoi()),
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
