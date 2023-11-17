import { pipe } from 'fp-ts/function';
import { TestFramework, createTestFramework } from '../../../framework/index.js';
import { arbitraryArticleId } from '../../../types/article-id.helper.js';
import { constructListedIn } from '../../../../src/html-pages/article-page/construct-view-model/construct-listed-in.js';
import * as LOID from '../../../../src/types/list-owner-id.js';
import { arbitraryUserId } from '../../../types/user-id.helper.js';
import { List } from '../../../../src/types/list.js';
import { ViewModel } from '../../../../src/html-pages/article-page/view-model.js';
import { arbitraryCreateListCommand } from '../../../write-side/commands/create-list-command.helper.js';
import { arbitraryCreateUserAccountCommand } from '../../../write-side/commands/create-user-account-command.helper.js';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper.js';

describe('construct-listed-in', () => {
  let framework: TestFramework;
  const articleId = arbitraryArticleId();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the article is not in any list', () => {
    let listedIn: ViewModel['listedIn'];

    beforeEach(() => {
      listedIn = pipe(
        articleId,
        constructListedIn(framework.dependenciesForViews),
      );
    });

    it('returns empty', () => {
      expect(listedIn).toStrictEqual([]);
    });
  });

  describe('when the article is in a list owned by a user', () => {
    let listedIn: ViewModel['listedIn'];
    const createUserAccountCommand = arbitraryCreateUserAccountCommand();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(createUserAccountCommand);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(createUserAccountCommand.userId))[0];
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      listedIn = pipe(
        articleId,
        constructListedIn(framework.dependenciesForViews),
      );
    });

    it('returns the list id', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listId: list.id,
      })]);
    });

    it('returns the list name', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listName: list.name,
      })]);
    });

    it('returns the list owner name', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listOwnerName: createUserAccountCommand.handle,
      })]);
    });
  });

  describe('when the article is in a list owned by a user that does not exist', () => {
    let listedIn: ViewModel['listedIn'];

    beforeEach(async () => {
      const createListCommand = {
        ...arbitraryCreateListCommand(),
        ownerId: LOID.fromUserId(arbitraryUserId()),
      };
      await framework.commandHelpers.createList(createListCommand);
      await framework.commandHelpers.addArticleToList(articleId, createListCommand.listId);
      listedIn = pipe(
        articleId,
        constructListedIn(framework.dependenciesForViews),
      );
    });

    it('returns a default value in place of the list owner name', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listOwnerName: 'A user',
      })]);
    });
  });

  describe('when the article is in a list owned by a group', () => {
    let listedIn: ViewModel['listedIn'];
    const addGroupCommand = arbitraryAddGroupCommand();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(addGroupCommand.groupId))[0];
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      listedIn = pipe(
        articleId,
        constructListedIn(framework.dependenciesForViews),
      );
    });

    it('returns the list id', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listId: list.id,
      })]);
    });

    it('returns the list name', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listName: list.name,
      })]);
    });

    it('returns the list owner name', () => {
      expect(listedIn).toStrictEqual([expect.objectContaining({
        listOwnerName: addGroupCommand.name,
      })]);
    });
  });
});
