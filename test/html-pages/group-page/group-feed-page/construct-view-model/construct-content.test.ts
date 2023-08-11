import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../../../dummy-logger';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-feed-page/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { arbitraryGroup } from '../../../../types/group.helper';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { constructContent } from '../../../../../src/html-pages/group-page/group-feed-page/construct-view-model/construct-content';
import { List } from '../../../../../src/types/list';
import * as LOID from '../../../../../src/types/list-owner-id';
import { arbitraryArticleId } from '../../../../types/article-id.helper';

describe('construct-content', () => {
  let framework: TestFramework;
  const group = arbitraryGroup();

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when the group has evaluated articles', () => {
    let viewModel: ViewModel['content'];
    let initialGroupList: List;
    const article1 = arbitraryArticleId();
    const article2 = arbitraryArticleId();

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);
      initialGroupList = framework.queries.selectAllListsOwnedBy(LOID.fromGroupId(group.id))[0];
      await framework.commandHelpers.addArticleToList(article1, initialGroupList.id);
      await framework.commandHelpers.addArticleToList(article2, initialGroupList.id);

      viewModel = await pipe(
        constructContent({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          logger: dummyLogger,
        },
        group.id),
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
    let viewModel: ViewModel['content'];

    beforeEach(async () => {
      await framework.commandHelpers.createGroup(group);

      viewModel = await pipe(
        constructContent({
          ...framework.queries,
          ...framework.happyPathThirdParties,
          logger: dummyLogger,
        },
        group.id),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains a no-activity-yet message', () => {
      expect(viewModel).toBe('no-activity-yet');
    });
  });
});
