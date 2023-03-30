import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { createTestFramework, TestFramework } from '../../../../framework';
import { arbitraryGroup } from '../../../../types/group.helper';
import { arbitraryList } from '../../../../types/list-helper';
import * as LOID from '../../../../../src/types/list-owner-id';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-lists-page/view-model';
import { constructViewModel } from '../../../../../src/html-pages/group-page/group-lists-page/construct-view-model/construct-view-model';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { List } from '../../../../../src/types/list';
import { arbitraryArticleId } from '../../../../types/article-id.helper';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const group = arbitraryGroup();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has more than one list', () => {
    let initialGroupList: List;
    const middleList = arbitraryList(LOID.fromGroupId(group.id));
    const mostRecentlyUpdatedList = arbitraryList(LOID.fromGroupId(group.id));
    let viewmodel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      // eslint-disable-next-line prefer-destructuring
      initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
      await framework.commandHelpers.createList(middleList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), middleList.id);
      await framework.commandHelpers.createList(mostRecentlyUpdatedList);
      await framework.commandHelpers.addArticleToList(arbitraryArticleId(), mostRecentlyUpdatedList.id);

      viewmodel = await pipe(
        {
          slug: group.slug,
          user: O.none,
        },
        constructViewModel(framework.queries),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns lists in descending order of updated date', () => {
      expect(viewmodel.listCards).toStrictEqual([
        expect.objectContaining({
          listId: mostRecentlyUpdatedList.id,
        }),
        expect.objectContaining({
          listId: middleList.id,
        }),
        expect.objectContaining({
          listId: initialGroupList.id,
        }),
      ]);
    });
  });
});
