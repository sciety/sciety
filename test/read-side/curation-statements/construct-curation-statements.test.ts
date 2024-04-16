import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Dependencies } from '../../../src/html-pages/paper-activity-page/construct-view-model/dependencies';
import {
  constructCurationStatements,
} from '../../../src/read-side/curation-statements/construct-curation-statements';
import * as DE from '../../../src/types/data-error';
import { EvaluationLocator } from '../../../src/types/evaluation-locator';
import * as PH from '../../../src/types/publishing-history';
import { RecordEvaluationPublicationCommand } from '../../../src/write-side/commands';
import { createTestFramework, TestFramework } from '../../framework';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';
import { arbitraryPaperExpression } from '../../types/paper-expression.helper';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper';

describe('construct-curation-statements', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const expressionDoi = arbitraryExpressionDoi();
  const addGroupA = arbitraryAddGroupCommand();
  const recordCurationStatementByGroupA: RecordEvaluationPublicationCommand = {
    ...arbitraryRecordEvaluationPublicationCommand(),
    groupId: addGroupA.groupId,
    expressionDoi,
    evaluationType: 'curation-statement' as const,
  };

  const publishingHistory = pipe(
    [
      {
        ...arbitraryPaperExpression(),
        expressionDoi,
      },
    ],
    PH.fromExpressions,
    E.getOrElseW(shouldNotBeCalled),
  );
  const getCurationStatementLocators = async (dependencies: Dependencies) => pipe(
    constructCurationStatements(dependencies, publishingHistory),
    T.map(RA.map((curationStatements) => curationStatements.evaluationLocator)),
  )();

  let curationStatementLocators: ReadonlyArray<EvaluationLocator>;

  describe('when there are multiple curation statements but only one of the groups exists', () => {
    const evaluation2Command: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      expressionDoi,
      evaluationType: 'curation-statement' as const,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupA);
      await framework.commandHelpers.recordEvaluationPublication(recordCurationStatementByGroupA);
      await framework.commandHelpers.recordEvaluationPublication(evaluation2Command);
      curationStatementLocators = await getCurationStatementLocators(framework.dependenciesForViews);
    });

    it('only returns the curation statement by the existing group', () => {
      expect(curationStatementLocators).toStrictEqual([recordCurationStatementByGroupA.evaluationLocator]);
    });
  });

  describe('when no curation statements can be retrieved', () => {
    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupA);
      await framework.commandHelpers.recordEvaluationPublication(recordCurationStatementByGroupA);
      curationStatementLocators = await getCurationStatementLocators({
        ...framework.dependenciesForViews,
        fetchEvaluation: () => TE.left(DE.unavailable),
      });
    });

    it('returns no curation statements', () => {
      expect(curationStatementLocators).toStrictEqual([]);
    });
  });

  describe('when one curation statement can be retrieved and one cannot', () => {
    const addGroupB = arbitraryAddGroupCommand();
    const retrievableEvaluationLocator = arbitraryEvaluationLocator();
    const recordRetrievableCurationStatementByGroupB: RecordEvaluationPublicationCommand = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      evaluationLocator: retrievableEvaluationLocator,
      groupId: addGroupB.groupId,
      expressionDoi,
      evaluationType: 'curation-statement' as const,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupA);
      await framework.commandHelpers.addGroup(addGroupB);
      await framework.commandHelpers.recordEvaluationPublication(recordRetrievableCurationStatementByGroupB);
      await framework.commandHelpers.recordEvaluationPublication(recordCurationStatementByGroupA);
      curationStatementLocators = await getCurationStatementLocators({
        ...framework.dependenciesForViews,
        fetchEvaluation: (evaluationLocator: EvaluationLocator) => (evaluationLocator === retrievableEvaluationLocator
          ? TE.right({
            url: new URL(arbitraryUri()),
            fullText: arbitrarySanitisedHtmlFragment(),
          })
          : TE.left(DE.unavailable)),
      });
    });

    it('only returns the retrievable curation statement', () => {
      expect(curationStatementLocators).toStrictEqual([retrievableEvaluationLocator]);
    });
  });

  describe('when there are multiple curation statements by the same group', () => {
    const latestEvaluationLocator = arbitraryEvaluationLocator();
    const recordLaterCurationStatementByGroupA = {
      ...recordCurationStatementByGroupA,
      evaluationLocator: latestEvaluationLocator,
      publishedAt: new Date('2023-08-05'),
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupA);
      await framework.commandHelpers.recordEvaluationPublication(recordCurationStatementByGroupA);
      await framework.commandHelpers.recordEvaluationPublication(recordLaterCurationStatementByGroupA);
      curationStatementLocators = await getCurationStatementLocators(framework.dependenciesForViews);
    });

    it('includes only the latest curation statement', () => {
      expect(curationStatementLocators).toStrictEqual([latestEvaluationLocator]);
    });
  });
});
