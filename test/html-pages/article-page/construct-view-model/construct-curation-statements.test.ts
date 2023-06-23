import * as TE from 'fp-ts/TaskEither';
import { URL } from 'url';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryGroup } from '../../../types/group.helper';
import {
  constructCurationStatements,
} from '../../../../src/shared-components/construct-curation-statements';
import * as DE from '../../../../src/types/data-error';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';
import { EvaluationLocator } from '../../../../src/types/evaluation-locator';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../../../helpers';

describe('construct-curation-statements', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const group = arbitraryGroup();
  const articleId = arbitraryArticleId();

  describe('when there are multiple curation statements but only one of the groups exists', () => {
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.recordCurationStatement(articleId, group.id, arbitraryEvaluationLocator());
      await framework.commandHelpers.recordCurationStatement(
        articleId,
        arbitraryGroupId(),
        arbitraryEvaluationLocator(),
      );
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

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.recordCurationStatement(articleId, group.id, arbitraryEvaluationLocator());
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

    const evaluationLocator1 = arbitraryEvaluationLocator();
    const evaluationLocator2 = arbitraryEvaluationLocator();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      await framework.commandHelpers.recordCurationStatement(articleId, group.id, evaluationLocator1);
      await framework.commandHelpers.recordCurationStatement(articleId, group.id, evaluationLocator2);
      result = await constructCurationStatements({
        ...framework.dependenciesForViews,
        fetchReview: (evaluationLocator: EvaluationLocator) => (evaluationLocator === evaluationLocator1
          ? TE.left(DE.unavailable)
          : TE.right({ url: new URL(arbitraryUri()), fullText: arbitrarySanitisedHtmlFragment() })),
      }, articleId)();
    });

    it('that curation statement is skipped', () => {
      expect(result).toHaveLength(1);
    });
  });
});
