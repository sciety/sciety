import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { List } from '../../../../../src/read-models/lists';
import { constructContainingList } from '../../../../../src/read-side/html-pages/paper-activity-page/construct-view-model/construct-containing-list';
import { ViewModel } from '../../../../../src/read-side/html-pages/paper-activity-page/view-model';
import { ArticleId } from '../../../../../src/types/article-id';
import * as LOID from '../../../../../src/types/list-owner-id';
import { TestFramework, createTestFramework } from '../../../../framework';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { arbitraryExpressionDoi } from '../../../../types/expression-doi.helper';
import { arbitraryUserId } from '../../../../types/user-id.helper';
import { arbitraryAddGroupCommand } from '../../../../write-side/commands/add-group-command.helper';
import { arbitraryCreateListCommand } from '../../../../write-side/commands/create-list-command.helper';
import { arbitraryCreateUserAccountCommand } from '../../../../write-side/commands/create-user-account-command.helper';

describe('construct-containing-list', () => {
  let framework: TestFramework;
  const expressionDoi = arbitraryExpressionDoi();

  beforeEach(() => {
    framework = createTestFramework();
  });

  let result: ViewModel['listedIn'][number];

  describe('when the paper is in a list owned by a user', () => {
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      await framework.commandHelpers.addArticleToList({ articleId: new ArticleId(expressionDoi), listId: list.id });
      result = pipe(
        list,
        constructContainingList(framework.dependenciesForViews),
      );
    });

    it('returns the list name', () => {
      expect(result.listName).toStrictEqual(list.name);
    });

    it('returns the list owner name', () => {
      expect(result.listOwnerName).toStrictEqual(createUserAccountCommand.handle);
    });
  });

  describe('when the paper is in a list owned by a user that does not exist', () => {
    beforeEach(async () => {
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      await framework.commandHelpers.createList(createListCommand);
      const list = pipe(
        createListCommand.listId,
        framework.queries.lookupList,
        O.getOrElseW(shouldNotBeCalled),
      );
      await framework.commandHelpers.addArticleToList(
        { articleId: new ArticleId(expressionDoi), listId: createListCommand.listId },
      );
      result = pipe(
        list,
        constructContainingList(framework.dependenciesForViews),
      );
    });

    it('returns a default value in place of the list owner name', () => {
      expect(result.listOwnerName).toBe('A user');
    });
  });

  describe('when the paper is in a list owned by a group', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      await framework.commandHelpers.addArticleToList({ articleId: new ArticleId(expressionDoi), listId: list.id });
      result = pipe(
        list,
        constructContainingList(framework.dependenciesForViews),
      );
    });

    it('returns the list name', () => {
      expect(result.listName).toStrictEqual(list.name);
    });

    it('returns the list owner name', () => {
      expect(result.listOwnerName).toStrictEqual(addGroupCommand.name);
    });
  });
});
