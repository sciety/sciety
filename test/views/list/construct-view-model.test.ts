import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { createTestFramework, TestFramework } from '../../framework';
import * as LOID from '../../../src/types/list-owner-id';
import { constructViewModel } from '../../../src/views/list/construct-view-model';
import { arbitraryCreateUserAccountCommand } from '../../write-side/commands/create-user-account-command.helper';
import { ExpressionDoi } from '../../../src/types/expression-doi';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the list contains two articles', () => {
    const articleId1 = arbitraryArticleId();
    const articleId2 = arbitraryArticleId();
    let orderedExpressionDois: ReadonlyArray<ExpressionDoi>;
    const createList = async () => {
      const createUserAccountCommand = arbitraryCreateUserAccountCommand();
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      return list.id;
    };

    beforeEach(async () => {
      const listId = await createList();
      await framework.commandHelpers.addArticleToList(articleId1, listId);
      await framework.commandHelpers.addArticleToList(articleId2, listId);
      orderedExpressionDois = await pipe(
        { id: listId },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
        T.map((viewModel) => viewModel.articles),
        T.map(RA.map((article) => article.articleCard.expressionDoi)),
      )();
    });

    it('sorts the articles in reverse order of being added to the list', () => {
      expect(orderedExpressionDois).toStrictEqual([articleId2.value, articleId1.value]);
    });
  });
});
