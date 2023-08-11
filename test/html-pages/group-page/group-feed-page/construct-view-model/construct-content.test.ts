import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../../../dummy-logger';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-feed-page/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { arbitraryGroup } from '../../../../types/group.helper';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { constructContent } from '../../../../../src/html-pages/group-page/group-feed-page/construct-view-model/construct-content';
import * as LOID from '../../../../../src/types/list-owner-id';
import { arbitraryArticleId } from '../../../../types/article-id.helper';
import { Dependencies } from '../../../../../src/html-pages/group-page/group-feed-page/construct-view-model/dependencies';

describe('construct-content', () => {
  let framework: TestFramework;
  let dependencies: Dependencies;
  const group = arbitraryGroup();
  let viewModel: ViewModel['content'];

  beforeEach(async () => {
    framework = createTestFramework();
    dependencies = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      logger: dummyLogger,
    };
    await framework.commandHelpers.createGroup(group);
  });

  describe('when the group has evaluated articles', () => {
    const article1 = arbitraryArticleId();
    const article2 = arbitraryArticleId();

    beforeEach(async () => {
      const initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
      await framework.commandHelpers.addArticleToList(article1, initialGroupList.id);
      await framework.commandHelpers.addArticleToList(article2, initialGroupList.id);

      viewModel = await pipe(
        constructContent(
          dependencies,
          group.id,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains article cards', () => {
      expect(viewModel).toStrictEqual([
        E.right(expect.objectContaining({
          articleId: article2,
        })),
        E.right(expect.objectContaining({
          articleId: article1,
        })),
      ]);
    });
  });

  describe('when the group has no evaluated articles', () => {
    beforeEach(async () => {
      viewModel = await pipe(
        constructContent(
          dependencies,
          group.id,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains a no-activity-yet message', () => {
      expect(viewModel).toBe('no-activity-yet');
    });
  });
});
