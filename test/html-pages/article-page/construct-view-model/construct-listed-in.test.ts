import { pipe } from 'fp-ts/function';
import { arbitraryUserDetails } from '../../../types/user-details.helper';
import { arbitraryGroup } from '../../../types/group.helper';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { ViewModel } from '../../../../src/html-pages/article-page/render-as-html/render-listed-in';
import { Ports, constructListedIn } from '../../../../src/html-pages/article-page/construct-view-model/construct-listed-in';
import * as LOID from '../../../../src/types/list-owner-id';
import { arbitraryList } from '../../../types/list-helper';
import { arbitraryUserId } from '../../../types/user-id.helper';

describe('construct-listed-in', () => {
  let framework: TestFramework;
  let adapters: Ports;
  const articleId = arbitraryArticleId();

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
    };
  });

  describe('when the article is not in any list', () => {
    let viewModel: ViewModel;

    beforeEach(() => {
      viewModel = pipe(
        articleId,
        constructListedIn(adapters),
      );
    });

    it('returns empty', () => {
      expect(viewModel).toStrictEqual([]);
    });
  });

  describe('when the article is in a list owned by a user', () => {
    let viewModel: ViewModel;
    const user = arbitraryUserDetails();

    beforeEach(async () => {
      await framework.commandHelpers.createUserAccount(user);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromUserId(user.id))[0];
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      viewModel = pipe(
        articleId,
        constructListedIn(adapters),
      );
    });

    it.todo('returns the list id');

    it.todo('returns the list name');

    it('returns the list owner name', () => {
      expect(viewModel).toStrictEqual([expect.objectContaining({
        listOwnerName: user.handle,
      })]);
    });
  });

  describe('when the article is in a list owned by a user that does not exist', () => {
    let viewModel: ViewModel;

    beforeEach(async () => {
      const list = arbitraryList(LOID.fromUserId(arbitraryUserId()));
      await framework.commandHelpers.createList(list);
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      viewModel = pipe(
        articleId,
        constructListedIn(adapters),
      );
    });

    it('returns a default value in place of the list owner name', () => {
      expect(viewModel).toStrictEqual([expect.objectContaining({
        listOwnerName: 'A user',
      })]);
    });
  });

  describe('when the article is in a list owned by a group', () => {
    let viewModel: ViewModel;
    const group = arbitraryGroup();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      const list = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
      await framework.commandHelpers.addArticleToList(articleId, list.id);
      viewModel = pipe(
        articleId,
        constructListedIn(adapters),
      );
    });

    it.todo('returns the list id');

    it.todo('returns the list name');

    it('returns the list owner name', () => {
      expect(viewModel).toStrictEqual([expect.objectContaining({
        listOwnerName: group.name,
      })]);
    });
  });
});
