import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../src/html-pages/groups-page/construct-view-model/construct-view-model.js';
import { TestFramework, createTestFramework } from '../../../framework/index.js';
import { shouldNotBeCalled } from '../../../should-not-be-called.js';
import { GroupCardViewModel } from '../../../../src/shared-components/group-card/view-model.js';
import { arbitraryAddGroupCommand } from '../../../write-side/commands/add-group-command.helper.js';
import { arbitraryRecordEvaluationPublicationCommand } from '../../../write-side/commands/record-evaluation-publication-command.helper.js';

type ViewModel = ReadonlyArray<GroupCardViewModel>;

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: ViewModel;

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
      result = await pipe(
        framework.queries,
        constructViewModel,
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('the group cards are listed in descending order of latest activity', () => {
      expect(result).toStrictEqual([
        expect.objectContaining({
          name: addMostRecentlyActiveGroup.name,
        }),
        expect.objectContaining({
          name: addLeastRecentlyActiveGroup.name,
        }),
      ]);
    });
  });
});
