import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { DependenciesForViews } from '../../../../src/read-side/dependencies-for-views';
import { constructViewModel } from '../../../../src/read-side/html-pages/explore-page/construct-view-model/construct-view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { shouldNotBeCalled } from '../../../should-not-be-called';
import { arbitraryDataError } from '../../../types/data-error.helper';

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

  describe('when the dependency returns some categories', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchSearchCategories: () => TE.right(['B', 'C', 'A']),
      };
      categories = await getCategories(dependencies);
    });

    it('displays them in alphabetical order', () => {
      expect(categories).toStrictEqual(O.some(['A', 'B', 'C']));
    });
  });

  describe('when the dependency returns no categories', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchSearchCategories: () => TE.right([]),
      };
      categories = await getCategories(dependencies);
    });

    it('displays an empty categories section and list', () => {
      expect(categories).toStrictEqual(O.some([]));
    });
  });

  describe('when the dependency fails', () => {
    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchSearchCategories: () => TE.left(arbitraryDataError()),
      };
      categories = await getCategories(dependencies);
    });

    it('does not display the section', () => {
      expect(categories).toStrictEqual(O.none);
    });
  });
});
