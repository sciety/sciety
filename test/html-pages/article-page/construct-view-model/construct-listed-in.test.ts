import { pipe } from 'fp-ts/function';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { ViewModel } from '../../../../src/html-pages/article-page/render-as-html/render-listed-in';
import { Ports, constructListedIn } from '../../../../src/html-pages/article-page/construct-view-model/construct-listed-in';

describe('construct-listed-in', () => {
  let framework: TestFramework;
  let adapters: Ports;
  const articleId = arbitraryArticleId();

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
    };
  });

  describe('when the article is not in any list', () => {
    let viewModel: ViewModel;

    beforeEach(() => {
      viewModel = pipe(
        articleId,
        constructListedIn(adapters),
      );
    });

    it('returns empty', () => {
      expect(viewModel).toStrictEqual([]);
    });
  });

  describe('when the article is in a list owned by a user', () => {
    it.todo('returns the list id');

    it.todo('returns the list name');

    it.todo('returns the list owner name');
  });

  describe('when the article is in a list owned by a group', () => {
    it.todo('returns the list id');

    it.todo('returns the list name');

    it.todo('returns the list owner name');
  });
});
