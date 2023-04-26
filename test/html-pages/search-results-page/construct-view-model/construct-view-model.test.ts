import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructViewModel, Ports } from '../../../../src/html-pages/search-results-page/construct-view-model/construct-view-model';
import { ViewModel } from '../../../../src/html-pages/search-results-page/view-model';
import { TestFramework, createTestFramework } from '../../../framework';
import { arbitraryString } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

describe('construct-view-model', () => {
  let framework: TestFramework;
  let adapters: Ports;

  beforeEach(() => {
    framework = createTestFramework();
    adapters = {
      ...framework.queries,
      ...framework.happyPathThirdParties,
      getAllEvents: framework.getAllEvents,
    };
  });

  describe('when the category is "articles"', () => {
    const query = arbitraryString();
    const category = O.some('articles' as const);
    const cursor = O.none;
    const page = O.none;
    const evaluatedOnly = O.none;

    describe('and there are results', () => {
      let result: ViewModel;

      beforeEach(async () => {
        result = await pipe(
          {
            query, category, cursor, page, evaluatedOnly,
          },
          constructViewModel(adapters, 1),
          TE.getOrElse(shouldNotBeCalled),
        )();
      });

      it.todo('article cards are included in the view model');

      it.todo('the articles tab is active');

      it.failing('the number of articles found is displayed', () => {
        expect(result.availableArticleMatches).toBe(1);
      });

      it.todo('the number of groups found is displayed');
    });

    describe('but there are no results', () => {
      it.todo('write many of these');
    });
  });

  describe('when the category is "groups"', () => {
    describe('and there are results', () => {
      it.todo('write many of these');
    });

    describe('but there are no results', () => {
      it.todo('write many of these');
    });
  });

  describe('when the category is not provided', () => {
    it.todo('the category defaults to articles');
  });
});
