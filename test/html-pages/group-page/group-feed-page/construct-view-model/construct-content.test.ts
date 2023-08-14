import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { dummyLogger } from '../../../../dummy-logger';
import { ViewModel } from '../../../../../src/html-pages/group-page/group-feed-page/view-model';
import { createTestFramework, TestFramework } from '../../../../framework';
import { arbitraryGroup } from '../../../../types/group.helper';
import { shouldNotBeCalled } from '../../../../should-not-be-called';
import { constructContent } from '../../../../../src/html-pages/group-page/group-feed-page/construct-view-model/construct-content';
import { arbitraryArticleId } from '../../../../types/article-id.helper';
import { Dependencies } from '../../../../../src/html-pages/group-page/group-feed-page/construct-view-model/dependencies';

describe('construct-content', () => {
  let framework: TestFramework;
  let dependencies: Dependencies;
  const group = arbitraryGroup();
  let content: ViewModel['content'];

  beforeEach(async () => {
    framework = createTestFramework();
    dependencies = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      logger: dummyLogger,
    };
    await framework.commandHelpers.createGroup(group);
  });

  describe('when the group\'s evaluated articles list contains articles', () => {
    const article1 = arbitraryArticleId();
    const article2 = arbitraryArticleId();

    beforeEach(async () => {
      const groupEvaluatedArticlesList = pipe(
        framework.queries.getEvaluatedArticlesListIdForGroup(group.id),
        O.getOrElseW(shouldNotBeCalled),
      );
      await framework.commandHelpers.addArticleToList(article1, groupEvaluatedArticlesList);
      await framework.commandHelpers.addArticleToList(article2, groupEvaluatedArticlesList);

      content = await pipe(
        constructContent(
          dependencies,
          group.id,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains article cards', () => {
      expect(content).toHaveLength(2);
    });

    it('has the most recently added article as the first article card', () => {
      expect(content[0]).toStrictEqual(E.right(expect.objectContaining({
        articleId: article2,
      })));
    });
  });

  describe('when the group\'s evaluated articles list is empty', () => {
    beforeEach(async () => {
      content = await pipe(
        constructContent(
          dependencies,
          group.id,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('contains a no-activity-yet message', () => {
      expect(content).toBe('no-activity-yet');
    });
  });
});
