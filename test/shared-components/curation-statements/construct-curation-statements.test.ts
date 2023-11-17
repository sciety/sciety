import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { arbitraryAddGroupCommand } from '../../write-side/commands/add-group-command.helper.js';
import { createTestFramework, TestFramework } from '../../framework/index.js';
import {
  constructCurationStatements,
} from '../../../src/shared-components/curation-statements/construct-curation-statements.js';
import * as DE from '../../../src/types/data-error.js';
import { arbitraryArticleId } from '../../types/article-id.helper.js';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper.js';
import { EvaluationLocator } from '../../../src/types/evaluation-locator.js';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../helpers.js';
import { arbitraryRecordEvaluationPublicationCommand } from '../../write-side/commands/record-evaluation-publication-command.helper.js';
import { Dependencies } from '../../../src/html-pages/article-page/construct-view-model/dependencies.js';

describe('construct-curation-statements', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const articleId = arbitraryArticleId();
  const addGroupA = arbitraryAddGroupCommand();
  const recordCurationStatementByGroupA = {
    ...arbitraryRecordEvaluationPublicationCommand(),
    groupId: addGroupA.groupId,
    articleId,
    evaluationType: 'curation-statement' as const,
  };

  const getCurationStatementLocators = async (dependencies: Dependencies) => pipe(
    constructCurationStatements(dependencies, articleId),
    T.map(RA.map((curationStatements) => curationStatements.evaluationLocator)),
  )();

  let curationStatementLocators: ReadonlyArray<EvaluationLocator>;

  describe('when there are multiple curation statements but only one of the groups exists', () => {
    const evaluation2Command = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      articleId,
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
        fetchReview: () => TE.left(DE.unavailable),
      });
    });

    it('returns no curation statements', () => {
      expect(curationStatementLocators).toStrictEqual([]);
    });
  });

  describe('when one curation statement can be retrieved and one cannot', () => {
    const addGroupB = arbitraryAddGroupCommand();
    const retrievableEvaluationLocator = arbitraryEvaluationLocator();
    const recordRetrievableCurationStatementByGroupB = {
      ...arbitraryRecordEvaluationPublicationCommand(),
      evaluationLocator: retrievableEvaluationLocator,
      groupId: addGroupB.groupId,
      articleId,
      evaluationType: 'curation-statement' as const,
    };

    beforeEach(async () => {
      await framework.commandHelpers.addGroup(addGroupA);
      await framework.commandHelpers.addGroup(addGroupB);
      await framework.commandHelpers.recordEvaluationPublication(recordRetrievableCurationStatementByGroupB);
      await framework.commandHelpers.recordEvaluationPublication(recordCurationStatementByGroupA);
      curationStatementLocators = await getCurationStatementLocators({
        ...framework.dependenciesForViews,
        fetchReview: (evaluationLocator: EvaluationLocator) => (evaluationLocator === retrievableEvaluationLocator
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
