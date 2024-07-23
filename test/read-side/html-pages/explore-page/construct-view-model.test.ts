import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel } from '../../../../src/read-side/html-pages/explore-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/read-side/html-pages/explore-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are categories', () => {
    it.todo('returns them in alphabetical order');
  });

  describe('when there are no categories available', () => {
    let categories: ViewModel['browseByCategory'];

    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchSearchCategories: () => TE.right([]),
      };
      categories = await pipe(
        constructViewModel(dependencies),
        TE.map((viewModel) => viewModel.browseByCategory),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns an empty array', () => {
      expect(categories).toStrictEqual(O.some([]));
    });
  });
});
