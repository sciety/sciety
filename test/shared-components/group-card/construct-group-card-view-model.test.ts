import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryGroup } from '../../types/group.helper';
import { constructGroupCardViewModel, GroupViewModel } from '../../../src/shared-components/group-card';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('construct-group-card-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when all data is available', () => {
    const group = arbitraryGroup();
    let viewModel: GroupViewModel;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      viewModel = pipe(
        group.id,
        constructGroupCardViewModel(framework.queries),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('contains the group id', () => {
      expect(viewModel.id).toStrictEqual(group.id);
    });

    it.todo('contains the group name');

    it.todo('contains the group description');

    it.todo('contains the group avatar path');

    it.todo('contains the group slug');

    it.todo('contains the list count');

    it.todo('contains the follower count');

    it.todo('contains the evaluation count');

    it.todo('contains the latest activity');
  });

  describe('when the group data cannot be retrieved', () => {
    it.todo('returns not found');
  });

  describe('when the group activity data cannot be retrieved', () => {
    it.todo('returns not found');
  });
});
