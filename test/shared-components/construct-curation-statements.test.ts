import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { arbitraryAddGroupCommand } from '../write-side/commands/add-group-command.helper';
import { createTestFramework, TestFramework } from '../framework';
import {
  constructCurationStatements,
} from '../../src/shared-components/construct-curation-statements';
import * as DE from '../../src/types/data-error';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { EvaluationLocator } from '../../src/types/evaluation-locator';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../helpers';
import { arbitraryRecordEvaluationPublicationCommand } from '../write-side/commands/record-evaluation-publication-command.helper';

describe('construct-curation-statements', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const addGroupCommand = arbitraryAddGroupCommand();
  const articleId = arbitraryArticleId();

  describe('when there are multiple curation statements but only one of the groups exists', () => {
    let result: ReadonlyArray<string>;
    const evaluation1Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroupCommand.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
    };
    const evaluation2Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      articleId,
      evaluationType: 'curation-statement' as const,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1Command);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2Command);
      result = await pipe(
        constructCurationStatements(framework.dependenciesForViews, articleId),
        T.map(RA.map((curationStatements) => curationStatements.groupName)),
      )();
    });

    it('only returns the curation statement by the existing group', () => {
      expect(result).toStrictEqual([addGroupCommand.name]);
    });
  });

  describe('when a curation statement cannot be retrieved', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;
    const evaluationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroupCommand.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(evaluationCommand);
      result = await constructCurationStatements({
        ...framework.dependenciesForViews,
        fetchReview: () => TE.left(DE.unavailable),
      }, articleId)();
    });

    it('that curation statement is skipped', () => {
      expect(result).toStrictEqual([]);
    });
  });

  describe('when one curation statement can be retrieved and one cannot', () => {
    let result: ReadonlyArray<EvaluationLocator>;
    const addGroup2Command = arbitraryAddGroupCommand();
    const retrievableEvaluationLocator = arbitraryEvaluationLocator();
    const evaluation1Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      evaluationLocator: retrievableEvaluationLocator,
      groupId: addGroupCommand.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
    };
    const evaluation2Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroup2Command.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.addGroup(addGroup2Command);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1Command);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2Command);
      result = await pipe(
        constructCurationStatements({
          ...framework.dependenciesForViews,
          fetchReview: (evaluationLocator: EvaluationLocator) => (evaluationLocator === retrievableEvaluationLocator
            ? TE.right({
              url: new URL(arbitraryUri()),
              fullText: arbitrarySanitisedHtmlFragment(),
            })
            : TE.left(DE.unavailable)),
        }, articleId),
        T.map(RA.map((curationStatement) => curationStatement.evaluationLocator)),
      )();
    });

    it('only returns the retrievable curation statement', () => {
      expect(result).toStrictEqual([retrievableEvaluationLocator]);
    });
  });

  describe('when there are multiple curation statements by the same group', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;
    const evaluationLocator = arbitraryEvaluationLocator();
    const evaluation1Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      groupId: addGroupCommand.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
      publishedAt: new Date('2023-08-01'),
    };
    const evaluation2Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      evaluationLocator,
      groupId: addGroupCommand.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
      publishedAt: new Date('2023-08-05'),
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupCommand);
      await framework.commandHelpers.recordEvaluationPublication(evaluation1Command);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2Command);
      result = await constructCurationStatements(framework.dependenciesForViews, articleId)();
    });

    it('includes only the latest curation statement', () => {
      expect(result).toHaveLength(1);
      expect(result).toStrictEqual([expect.objectContaining({ evaluationLocator })]);
    });
  });
});
