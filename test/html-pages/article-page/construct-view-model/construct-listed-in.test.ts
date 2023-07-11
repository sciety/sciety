import { pipe } from 'fp-ts/function';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { constructListedIn } from '../../../../src/html-pages/article-page/construct-view-model/construct-listed-in';
import * as LOID from '../../../../src/types/list-owner-id';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserId } from '../../../types/user-id.helper';
import { List } from '../../../../src/shared-read-models/lists/list';
import { ViewModel } from '../../../../src/html-pages/article-page/view-model';

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
    const user = arbitraryUserDetails();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
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
        listOwnerName: user.handle,
      })]);
    });
  });

  describe('when the article is in a list owned by a user that does not exist', () => {
    let listedIn: ViewModel['listedIn'];

    beforeEach(async () => {
      const list = arbitraryList(LOID.fromUserId(arbitraryUserId()));
      await framework.commandHelpers.createList(list);
      await framework.commandHelpers.addArticleToList(articleId, list.id);
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
    const group = arbitraryGroup();
    let list: List;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
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
        listOwnerName: group.name,
      })]);
    });
  });
});
