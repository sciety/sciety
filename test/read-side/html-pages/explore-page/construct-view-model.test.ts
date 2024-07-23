import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../../src/read-side/dependencies-for-views';
import { constructViewModel } from '../../../../src/read-side/html-pages/explore-page/construct-view-model/construct-view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  const getCategories = async (dependencies: DependenciesForViews) => pipe(
    constructViewModel(dependencies),
    TE.map((viewModel) => viewModel.browseByCategory),
    TE.map(O.map(RA.map((category) => category.title))),
    TE.getOrElse(shouldNotBeCalled),
  )();

  let categories: Awaited<ReturnType<typeof getCategories>>;

  describe('when there are categories', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchSearchCategories: () => TE.right(['B', 'C', 'A']),
      };
      categories = await getCategories(dependencies);
    });

    it('returns them in alphabetical order', () => {
      expect(categories).toStrictEqual(O.some(['A', 'B', 'C']));
    });
  });

  describe('when there are no categories available', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchSearchCategories: () => TE.right([]),
      };
      categories = await getCategories(dependencies);
    });

    it('returns an empty array', () => {
      expect(categories).toStrictEqual(O.some([]));
    });
  });
});
