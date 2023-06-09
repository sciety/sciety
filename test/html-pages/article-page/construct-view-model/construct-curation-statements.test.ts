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

  describe('when the group exists', () => {
    const group = {
      ...arbitraryGroup(),
      id: curationStatements[0].groupId,
    };
    let result: ReturnType<typeof constructCurationStatements>;

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      result = constructCurationStatements({
        ...framework.queries,
        ...framework.happyPathThirdParties,
        logger: dummyLogger,
      }, new Doi(magicArticleId));
    });

    it('the curation statement is returned', () => {
      expect(result).toStrictEqual([expect.objectContaining({ groupName: group.name })]);
    });
  });

  describe('when the group does not exist', () => {
    it.todo('the curation statement is skipped');
  });
});
