import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as DE from '../../../src/types/data-error';
import { arbitraryGroup } from '../../types/group.helper';
import { constructGroupCardViewModel, GroupViewModel } from '../../../src/shared-components/group-card';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';

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
      await framework.commandHelpers.recordEvaluation({
        ...arbitraryRecordedEvaluation(),
        groupId: group.id,
      });
      viewModel = pipe(
        group.id,
        constructGroupCardViewModel(framework.queries),
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('contains the group id', () => {
      expect(viewModel.id).toStrictEqual(group.id);
    });

    it('contains the group name', () => {
      expect(viewModel.name).toStrictEqual(group.name);
    });

    it('contains the group description', () => {
      expect(viewModel.description).toStrictEqual(group.shortDescription);
    });

    it('contains the group avatar path', () => {
      expect(viewModel.avatarPath).toStrictEqual(group.avatarPath);
    });

    it('contains the group slug', () => {
      expect(viewModel.slug).toStrictEqual(group.slug);
    });

    it('contains the list count', () => {
      expect(viewModel.listCount).toBe(1);
    });

    it('contains the follower count', () => {
      expect(viewModel.followerCount).toBe(0);
    });

    it('contains the evaluation count', () => {
      expect(viewModel.evaluationCount).toBeGreaterThan(0);
    });

    it('contains the date of the latest activity', () => {
      expect(O.isSome(viewModel.latestActivity)).toBe(true);
    });
  });

  describe('when the group data cannot be retrieved', () => {
    let viewModel: E.Either<DE.DataError, unknown>;

    beforeEach(() => {
      viewModel = pipe(
        arbitraryGroupId(),
        constructGroupCardViewModel(framework.queries),
      );
    });

    it('returns not found', () => {
      expect(viewModel).toStrictEqual(E.left(DE.notFound));
    });
  });

  describe('when the group activity data cannot be retrieved', () => {
    it.todo('returns not found');
  });
});
