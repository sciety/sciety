import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { constructGroupCard } from '../../../src/shared-components/group-card';
import { toExpressionDoi } from '../../../src/types/article-id';
import * as DE from '../../../src/types/data-error';
import { AddGroupCommand } from '../../../src/write-side/commands';
import { createTestFramework, TestFramework } from '../../framework';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('construct-group-card', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const constructedViewModel = (command: AddGroupCommand) => pipe(
    command.groupId,
    constructGroupCard(framework.queries),
    E.getOrElseW(shouldNotBeCalled),
  );

  describe('when a group has joined', () => {
    const addGroupCommand = arbitraryAddGroupCommand();

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
    });

    it('contains the group id', () => {
      expect(constructedViewModel(addGroupCommand).id).toStrictEqual(addGroupCommand.groupId);
    });

    it('contains the group name', () => {
      expect(constructedViewModel(addGroupCommand).name).toStrictEqual(addGroupCommand.name);
    });

    it('contains the group description', () => {
      expect(constructedViewModel(addGroupCommand).description).toStrictEqual(addGroupCommand.shortDescription);
    });

    it('contains the group avatar path', () => {
      expect(constructedViewModel(addGroupCommand).avatarSrc).toStrictEqual(addGroupCommand.avatarPath);
    });

    it('contains the group slug', () => {
      expect(constructedViewModel(addGroupCommand).slug).toStrictEqual(addGroupCommand.slug);
    });

    it('contains the list count', () => {
      expect(constructedViewModel(addGroupCommand).listCount).toBe(1);
    });

    it('contains the follower count', () => {
      expect(constructedViewModel(addGroupCommand).followerCount).toBe(0);
    });

    describe('and has performed an evaluation', () => {
      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
        });
      });

      it('contains the evaluation count', () => {
        expect(constructedViewModel(addGroupCommand).evaluationCount).toBeGreaterThan(0);
      });

      it('contains the date of the latest activity', () => {
        expect(O.isSome(constructedViewModel(addGroupCommand).latestActivityAt)).toBe(true);
      });

      it('contains the curated articles count', () => {
        expect(constructedViewModel(addGroupCommand).curatedArticlesCount).toBe(0);
      });
    });

    describe('and has published one curation statements for an article', () => {
      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          groupId: addGroupCommand.groupId,
          evaluationType: 'curation-statement',
        });
      });

      it('contains the evaluation count', () => {
        expect(constructedViewModel(addGroupCommand).evaluationCount).toBeGreaterThan(0);
      });

      it('contains the date of the latest activity', () => {
        expect(O.isSome(constructedViewModel(addGroupCommand).latestActivityAt)).toBe(true);
      });

      it('has a curated articles count of 1', () => {
        expect(constructedViewModel(addGroupCommand).curatedArticlesCount).toBe(1);
      });
    });

    describe('and has published two curation statements for the same article', () => {
      const articleId = arbitraryArticleId();

      beforeEach(async () => {
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: toExpressionDoi(articleId),
          groupId: addGroupCommand.groupId,
          evaluationType: 'curation-statement',
        });
        await framework.commandHelpers.recordEvaluationPublication({
          ...arbitraryRecordEvaluationPublicationCommand(),
          expressionDoi: toExpressionDoi(articleId),
          groupId: addGroupCommand.groupId,
          evaluationType: 'curation-statement',
        });
      });

      it('contains the evaluation count', () => {
        expect(constructedViewModel(addGroupCommand).evaluationCount).toBeGreaterThan(0);
      });

      it('contains the date of the latest activity', () => {
        expect(O.isSome(constructedViewModel(addGroupCommand).latestActivityAt)).toBe(true);
      });

      it('has a curated articles count of 1', () => {
        expect(constructedViewModel(addGroupCommand).curatedArticlesCount).toBe(1);
      });
    });
  });

  describe('when no group with the specified group id has joined', () => {
    let viewModel: E.Either<DE.DataError, unknown>;

    beforeEach(() => {
      viewModel = pipe(
        arbitraryGroupId(),
        constructGroupCard(framework.queries),
      );
    });

    it('returns not found', () => {
      expect(viewModel).toStrictEqual(E.left(DE.notFound));
    });
  });
});
