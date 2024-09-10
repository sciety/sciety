import { constructSortedFeed } from '../../../../../../src/read-side/html-pages/group-page/group-home-page/construct-view-model/construct-sorted-feed';
import { createTestFramework, TestFramework } from '../../../../../framework';
import { arbitraryAddGroupCommand } from '../../../../../write-side/commands/add-group-command.helper';

describe('construct-sorted-feed', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has not evaluated any papers', () => {
    const addGroupCommand = arbitraryAddGroupCommand();
    let result: ReturnType<typeof constructSortedFeed>;

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      result = constructSortedFeed(framework.dependenciesForViews, addGroupCommand.groupId);
    });

    it('returns an empty array', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when the group has evaluated one paper', () => {
    it.todo('returns one expression doi');
  });

  describe('when the group has evaluated two papers', () => {
    it.todo('returns the most recently evaluated first');

    it.todo('returns the least recently evaluated second');
  });
});
