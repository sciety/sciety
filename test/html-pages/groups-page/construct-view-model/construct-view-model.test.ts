import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../src/html-pages/groups-page/construct-view-model/construct-view-model';
import { GroupCardViewModel } from '../../../../src/shared-components/group-card';
import { TestFramework, createTestFramework } from '../../../framework';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryGroup } from '../../../types/group.helper';
import { arbitraryRecordedEvaluation } from '../../../types/recorded-evaluation.helper';

type ViewModel = ReadonlyArray<GroupCardViewModel>;

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: ViewModel;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is more than one group', () => {
    const mostRecentlyActiveGroup = arbitraryGroup();
    const leastRecentlyActiveGroup = arbitraryGroup();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(mostRecentlyActiveGroup);
      await framework.commandHelpers.recordEvaluation({
        ...arbitraryRecordedEvaluation(),
        groupId: mostRecentlyActiveGroup.id,
        publishedAt: new Date('2020'),
      });
      await framework.commandHelpers.createGroup(leastRecentlyActiveGroup);
      await framework.commandHelpers.recordEvaluation({
        ...arbitraryRecordedEvaluation(),
        groupId: leastRecentlyActiveGroup.id,
        publishedAt: new Date('1970'),
      });
      result = await pipe(
        framework.queries,
        constructViewModel,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the group cards are listed in descending order of latest activity', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          name: mostRecentlyActiveGroup.name,
        }),
        expect.objectContaining({
          name: leastRecentlyActiveGroup.name,
        }),
      ]);
    });
  });
});
