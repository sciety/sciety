import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { arbitraryRecordedEvaluation } from '../types/recorded-evaluation.helper';
import { createTestFramework, TestFramework } from '../framework';
import { arbitraryGroup } from '../types/group.helper';
import {
  constructCurationStatements,
} from '../../src/shared-components/construct-curation-statements';
import * as DE from '../../src/types/data-error';
import { arbitraryArticleId } from '../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper';
import { EvaluationLocator } from '../../src/types/evaluation-locator';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../helpers';

describe('construct-curation-statements', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const group = arbitraryGroup();
  const articleId = arbitraryArticleId();

  describe('when there are multiple curation statements but only one of the groups exists', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;
    const evaluation1 = {
      ...arbitraryRecordedEvaluation(),
      groupId: group.id,
      articleId,
      type: O.some('curation-statement' as const),
    };
    const evaluation2 = {
      ...arbitraryRecordedEvaluation(),
      articleId,
      type: O.some('curation-statement' as const),
    };

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation1);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation2);
      result = await constructCurationStatements(framework.dependenciesForViews, articleId)();
    });

    it('the curation statement by the existing group is returned', () => {
      expect(result).toStrictEqual([expect.objectContaining({ groupName: group.name })]);
    });

    it('the curation statement by the missing group is skipped', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when a curation statement cannot be retrieved', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;
    const evaluation = {
      ...arbitraryRecordedEvaluation(),
      groupId: group.id,
      articleId,
      type: O.some('curation-statement' as const),
    };

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation);
      result = await constructCurationStatements({
        ...framework.dependenciesForViews,
        fetchReview: () => TE.left(DE.unavailable),
      }, articleId)();
    });

    it('that curation statement is skipped', () => {
      expect(result).toHaveLength(0);
    });
  });

  describe('when one curation statement can be retrieved and one cannot', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;
    const group2 = arbitraryGroup();

    const evaluationLocator1 = arbitraryEvaluationLocator();
    const evaluationLocator2 = arbitraryEvaluationLocator();
    const evaluation1 = {
      ...arbitraryRecordedEvaluation(),
      evaluationLocator: evaluationLocator1,
      groupId: group.id,
      articleId,
      type: O.some('curation-statement' as const),
    };
    const evaluation2 = {
      ...arbitraryRecordedEvaluation(),
      evaluationLocator: evaluationLocator2,
      groupId: group2.id,
      articleId,
      type: O.some('curation-statement' as const),
    };

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.deprecatedCreateGroup(group2);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation1);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation2);
      result = await constructCurationStatements({
        ...framework.dependenciesForViews,
        fetchReview: (evaluationLocator: EvaluationLocator) => (evaluationLocator === evaluationLocator1
          ? TE.left(DE.unavailable)
          : TE.right({
            url: new URL(arbitraryUri()),
            fullText: arbitrarySanitisedHtmlFragment(),
          })),
      }, articleId)();
    });

    it('that curation statement is skipped', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when there are multiple curation statements by the same group', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;
    const evaluationLocator = arbitraryEvaluationLocator();
    const evaluation1 = {
      ...arbitraryRecordedEvaluation(),
      groupId: group.id,
      articleId,
      type: O.some('curation-statement' as const),
      publishedAt: new Date('2023-08-01'),
    };
    const evaluation2 = {
      ...arbitraryRecordedEvaluation(),
      evaluationLocator,
      groupId: group.id,
      articleId,
      type: O.some('curation-statement' as const),
      publishedAt: new Date('2023-08-05'),
    };

    beforeEach(async () => {
      await framework.commandHelpers.deprecatedCreateGroup(group);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation1);
      await framework.commandHelpers.deprecatedRecordEvaluation(evaluation2);
      result = await constructCurationStatements(framework.dependenciesForViews, articleId)();
    });

    it('includes only the latest curation statement', () => {
      expect(result).toHaveLength(1);
      expect(result).toStrictEqual([expect.objectContaining({ evaluationLocator })]);
    });
  });
});
