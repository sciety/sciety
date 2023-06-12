import * as TE from 'fp-ts/TaskEither';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryGroup } from '../../../types/group.helper';
import {
  constructCurationStatements,
} from '../../../../src/html-pages/article-page/construct-view-model/construct-curation-statements';
import { dummyLogger } from '../../../dummy-logger';
import * as DE from '../../../../src/types/data-error';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';
import { arbitraryGroupId } from '../../../types/group-id.helper';

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
      result = await constructCurationStatements({
        ...framework.queries,
        ...framework.happyPathThirdParties,
        logger: dummyLogger,
      }, articleId)();
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
        ...framework.queries,
        ...framework.happyPathThirdParties,
        fetchReview: () => TE.left(DE.unavailable),
        logger: dummyLogger,
      }, articleId)();
    });

    it('that curation statement is skipped', () => {
      expect(result).toHaveLength(0);
    });
  });
});
