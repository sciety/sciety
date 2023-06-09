import * as TE from 'fp-ts/TaskEither';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryGroup } from '../../../types/group.helper';
import {
  constructCurationStatements, curationStatements, magicArticleId,
} from '../../../../src/html-pages/article-page/construct-view-model/construct-curation-statements';
import { dummyLogger } from '../../../dummy-logger';
import { Doi } from '../../../../src/types/doi';
import * as DE from '../../../../src/types/data-error';

describe('construct-curation-statements', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are multiple curation statements but only one of the groups exists', () => {
    const group = {
      ...arbitraryGroup(),
      id: curationStatements[0].groupId,
    };
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      result = await constructCurationStatements({
        ...framework.queries,
        ...framework.happyPathThirdParties,
        logger: dummyLogger,
      }, new Doi(magicArticleId))();
    });

    it('the curation statement by the existing group is returned', () => {
      expect(result).toStrictEqual([expect.objectContaining({ groupName: group.name })]);
    });

    it('the curation statement by the missing group is skipped', () => {
      expect(result).toHaveLength(1);
    });
  });

  describe('when a curation statement cannot be retrieved', () => {
    const group = {
      ...arbitraryGroup(),
      id: curationStatements[0].groupId,
    };
    let result: Awaited<ReturnType<ReturnType<typeof constructCurationStatements>>>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      result = await constructCurationStatements({
        ...framework.queries,
        ...framework.happyPathThirdParties,
        fetchReview: () => TE.left(DE.unavailable),
        logger: dummyLogger,
      }, new Doi(magicArticleId))();
    });

    it.failing('that curation statement is skipped', () => {
      expect(result).toHaveLength(0);
    });
  });
});
