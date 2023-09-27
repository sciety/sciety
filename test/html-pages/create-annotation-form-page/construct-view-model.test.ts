import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { constructViewModel } from '../../../src/html-pages/create-annotation-form-page/construct-view-model';
import { TestFramework, createTestFramework } from '../../framework';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { arbitraryListId } from '../../types/list-id.helper';
import * as DE from '../../../src/types/data-error';
import { ViewModel } from '../../../src/html-pages/create-annotation-form-page/view-model';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let result: Awaited<ReturnType<ReturnType<typeof constructViewModel>>>;

  beforeEach(async () => {
    framework = createTestFramework();
  });

  describe('when the article title is available', () => {
    let viewModel: ViewModel;

    beforeEach(async () => {
      viewModel = await pipe(
        constructViewModel(
          arbitraryArticleId().value,
          arbitraryListId(),
          framework.dependenciesForViews,
        ),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the article title', () => {
      expect(viewModel.articleTitle).toStrictEqual(expect.anything());
    });
  });

  describe('when the list title is available', () => {
    it.todo('returns the list title');
  });

  describe('when the article title is not available', () => {
    beforeEach(async () => {
      result = await constructViewModel(
        arbitraryArticleId().value,
        arbitraryListId(),
        {
          ...framework.dependenciesForViews,
          fetchArticle: () => TE.left(DE.notFound),
        },
      )();
    });

    it.failing('returns on the left', () => {
      expect(result).toStrictEqual(E.left(expect.anything()));
    });
  });

  describe('when the list title is not available', () => {
    it.todo('returns on the left');
  });
});
