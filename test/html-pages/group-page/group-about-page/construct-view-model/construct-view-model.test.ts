import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { createTestFramework, TestFramework } from '../../../../framework';
import { arbitraryGroup } from '../../../../types/group.helper';
import { arbitraryList } from '../../../../types/list-helper';
import * as LOID from '../../../../../src/types/list-owner-id';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-about-page/view-model';
import { constructViewModel, Ports } from '../../../../../src/html-pages/group-page/group-about-page/construct-view-model/construct-view-model';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { List } from '../../../../../src/types/list';

describe('construct-view-model', () => {
  let framework: TestFramework;
  const group = arbitraryGroup();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has more than one list', () => {
    let firstList: List;
    const secondList = arbitraryList(LOID.fromGroupId(group.id));
    const thirdList = arbitraryList(LOID.fromGroupId(group.id));
    let viewmodel: ViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      // eslint-disable-next-line prefer-destructuring
      firstList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
      await framework.commandHelpers.createList(secondList);
      await framework.commandHelpers.createList(thirdList);
      const adapters: Ports = {
        ...framework.queries,
        fetchStaticFile: () => TE.right(''),
      };
      viewmodel = await pipe(
        {
          slug: group.slug,
          user: O.none,
        },
        constructViewModel(adapters),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns lists in descending order of updated date', () => {
      expect(viewmodel.activeTab.lists.lists).toStrictEqual([
        expect.objectContaining({
          listId: thirdList.id,
        }),
        expect.objectContaining({
          listId: secondList.id,
        }),
        expect.objectContaining({
          listId: firstList.id,
        }),
      ]);
    });
  });
});
