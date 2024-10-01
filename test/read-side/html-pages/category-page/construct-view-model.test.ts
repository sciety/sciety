import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import { constructViewModel } from '../../../../src/read-side/html-pages/category-page/construct-view-model';
import { ViewModel } from '../../../../src/read-side/html-pages/category-page/view-model';
import { createTestFramework, TestFramework } from '../../../framework';
import { arbitraryNumber, arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('construct-view-model', () => {
  let framework: TestFramework;

  beforeEach(() => {
    framework = createTestFramework();
  });

  describe('when there are no evaluated expressions in the selected category', () => {
    let result: ViewModel;

    beforeEach(async () => {
      const dependencies = {
        ...framework.dependenciesForViews,
        fetchByCategory: () => TE.right({ expressionDois: [], totalItems: 0 }),
      };
      result = await pipe(
        {
          categoryName: arbitraryString() as tt.NonEmptyString,
          page: arbitraryNumber(1, 1000),
        },
        constructViewModel(dependencies),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('displays an informational message', () => {
      expect(result.content).toStrictEqual(E.left(expect.anything()));
    });
  });

  describe('when there is 1 evaluated expression in the selected category', () => {
    describe('and an article card can be displayed', () => {
      it.todo('displays 1 article card');
    });

    describe('and an article card cannot be displayed', () => {
      it.todo('displays an article error card');
    });
  });

  describe('when there are 2 evaluated expressions in the selected category', () => {
    describe('and all article cards can be displayed', () => {
      it.todo('displays 2 article cards');
    });

    describe('and 1 article card cannot be displayed', () => {
      it.todo('displays one article card');

      it.todo('displays one article error card');
    });

    describe('and no article cards can be displayed', () => {
      it.todo('displays article cards instead');
    });
  });
});
