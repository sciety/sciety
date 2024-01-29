import { pipe } from 'fp-ts/function';
import { TestFramework, createTestFramework } from '../../../framework';
import * as LOID from '../../../../src/types/list-owner-id';
import { List } from '../../../../src/types/list';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { ArticleId } from '../../../../src/types/article-id';
import { findAllListsContainingPaper } from '../../../../src/html-pages/paper-activity-page/construct-view-model/find-all-lists-containing-paper';

describe('find-all-lists-containing-paper', () => {
  let framework: TestFramework;
  const expressionDoi = arbitraryExpressionDoi();
  const articleId = new ArticleId(expressionDoi);

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the paper is not in any list', () => {
    let listedIn: ReadonlyArray<List>;

    beforeEach(() => {
      listedIn = pipe(
        expressionDoi,
        findAllListsContainingPaper(framework.dependenciesForViews),
      );
    });

    it('returns empty', () => {
      expect(listedIn).toStrictEqual([]);
    });
  });

  describe('when the paper is in a list', () => {
    let listedIn: ReadonlyArray<List>;
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      listedIn = pipe(
        expressionDoi,
        findAllListsContainingPaper(framework.dependenciesForViews),
      );
    });

    it('returns the list id', () => {
      expect(listedIn).toStrictEqual([list]);
    });
  });
});
