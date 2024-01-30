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

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the list contains two papers', () => {
    const articleId1 = arbitraryArticleId();
    const articleId2 = arbitraryArticleId();
    let orderedHrefs: ReadonlyArray<string>;
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
      orderedHrefs = await pipe(
        { id: listId },
        constructViewModel(framework.dependenciesForViews),
        TE.getOrElse(shouldNotBeCalled),
        T.map((viewModel) => viewModel.articles),
        T.map(RA.map((article) => article.articleCard.paperActivityPageHref)),
      )();
    });

    it('sorts the papers in reverse order of being added to the list', () => {
      expect(orderedHrefs).toHaveLength(2);
      expect(orderedHrefs[0]).toContain(articleId2.value);
      expect(orderedHrefs[1]).toContain(articleId1.value);
    });
  });
});
