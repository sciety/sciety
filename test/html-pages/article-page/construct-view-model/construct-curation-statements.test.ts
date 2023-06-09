import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryGroup } from '../../../types/group.helper';
import {
  constructCurationStatements, curationStatements, magicArticleId,
} from '../../../../src/html-pages/article-page/construct-view-model/construct-curation-statements';
import { dummyLogger } from '../../../dummy-logger';
import { Doi } from '../../../../src/types/doi';

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
    it.todo('that curation statement is skipped');
  });
});
