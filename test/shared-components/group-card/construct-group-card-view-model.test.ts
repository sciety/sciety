import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as DE from '../../../src/types/data-error';
import { Group } from '../../../src/types/group';
import { arbitraryGroup } from '../../types/group.helper';
import { constructGroupCardViewModel } from '../../../src/shared-components/group-card';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryRecordedEvaluation } from '../../types/recorded-evaluation.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryDoi } from '../../types/doi.helper';

describe('construct-group-card-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const constructedViewModel = (group: Group) => pipe(
    group.id,
    constructGroupCardViewModel(framework.queries),
    E.getOrElseW(shouldNotBeCalled),
  );

  describe('when a group has joined', () => {
    const group = arbitraryGroup();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
    });

    it('contains the group id', () => {
      expect(constructedViewModel(group).id).toStrictEqual(group.id);
    });

    it('contains the group name', () => {
      expect(constructedViewModel(group).name).toStrictEqual(group.name);
    });

    it('contains the group description', () => {
      expect(constructedViewModel(group).description).toStrictEqual(group.shortDescription);
    });

    it('contains the group avatar path', () => {
      expect(constructedViewModel(group).avatarPath).toStrictEqual(group.avatarPath);
    });

    it('contains the group slug', () => {
      expect(constructedViewModel(group).slug).toStrictEqual(group.slug);
    });

    it('contains the list count', () => {
      expect(constructedViewModel(group).listCount).toBe(1);
    });

    it('contains the follower count', () => {
      expect(constructedViewModel(group).followerCount).toBe(0);
    });

    describe('and has performed an evaluation', () => {
      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluation({
          ...arbitraryRecordedEvaluation(),
          groupId: group.id,
          type: O.none,
        });
      });

      it('contains the evaluation count', () => {
        expect(constructedViewModel(group).evaluationCount).toBeGreaterThan(0);
      });

      it('contains the date of the latest activity', () => {
        expect(O.isSome(constructedViewModel(group).latestActivityAt)).toBe(true);
      });

      it('contains the curated articles count', () => {
        expect(constructedViewModel(group).curatedArticlesCount).toBe(0);
      });
    });

    describe('and has published one curation statements for an article', () => {
      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluation({
          ...arbitraryRecordedEvaluation(),
          groupId: group.id,
          type: O.some('curation-statement'),
        });
      });

      it('contains the evaluation count', () => {
        expect(constructedViewModel(group).evaluationCount).toBeGreaterThan(0);
      });

      it('contains the date of the latest activity', () => {
        expect(O.isSome(constructedViewModel(group).latestActivityAt)).toBe(true);
      });

      it('contains the curated articles count', () => {
        expect(constructedViewModel(group).curatedArticlesCount).toBe(1);
      });
    });

    describe('and has published two curation statements for the same article', () => {
      const articleId = arbitraryDoi();

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluation({
          ...arbitraryRecordedEvaluation(),
          articleId,
          groupId: group.id,
          type: O.some('curation-statement'),
        });
        await framework.commandHelpers.recordEvaluation({
          ...arbitraryRecordedEvaluation(),
          articleId,
          groupId: group.id,
          type: O.some('curation-statement'),
        });
      });

      it('contains the evaluation count', () => {
        expect(constructedViewModel(group).evaluationCount).toBeGreaterThan(0);
      });

      it('contains the date of the latest activity', () => {
        expect(O.isSome(constructedViewModel(group).latestActivityAt)).toBe(true);
      });

      it.skip('contains the curated articles count', () => {
        expect(constructedViewModel(group).curatedArticlesCount).toBe(1);
      });
    });
  });

  describe('when no group with the specified group id has joined', () => {
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
});
