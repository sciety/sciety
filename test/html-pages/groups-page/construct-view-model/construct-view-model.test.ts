import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { constructViewModel } from '../../../../src/html-pages/groups-page/construct-view-model/construct-view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { GroupCardViewModel } from '../../../../src/shared-components/group-card/view-model';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../write-side/commands/record-evaluation-publication-command.helper';

type ViewModel = ReadonlyArray<GroupCardViewModel>;

describe('construct-view-model', () => {
  let framework: TestFramework;
  let groupNames: ReadonlyArray<ViewModel[number]['name']>;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there is more than one group', () => {
    const addMostRecentlyActiveGroup = arbitraryAddGroupCommand();
    const addLeastRecentlyActiveGroup = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addMostRecentlyActiveGroup);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addMostRecentlyActiveGroup.groupId,
        publishedAt: new Date('2020'),
      });
      await framework.commandHelpers.addGroup(addLeastRecentlyActiveGroup);
      await framework.commandHelpers.recordEvaluationPublication({
        ...arbitraryRecordEvaluationPublicationCommand(),
        groupId: addLeastRecentlyActiveGroup.groupId,
        publishedAt: new Date('1970'),
      });
      groupNames = await pipe(
        framework.queries,
        constructViewModel,
        TE.getOrElse(shouldNotBeCalled),
        T.map(RA.map((groupCard) => groupCard.name)),
      )();
    });

    it('the group cards are listed in descending order of latest activity', () => {
      expect(groupNames).toStrictEqual([
        addMostRecentlyActiveGroup.name,
        addLeastRecentlyActiveGroup.name,
      ]);
    });
  });
});
