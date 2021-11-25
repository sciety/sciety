import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { constructAllArticleActivityReadModel } from '../../src/shared-read-models/construct-all-article-activity-read-model';
import { arbitraryDoi } from '../types/doi.helper';

describe('construct-all-article-activity-read-model', () => {
  const articleId = arbitraryDoi();

  describe('when an article has no evaluations', () => {
    const articleActivity = pipe(
      [],
      constructAllArticleActivityReadModel,
      R.lookup(articleId.value),
    );

    it('article is not in the read model', () => {
      expect(O.isNone(articleActivity)).toBe(true);
    });
  });

  describe('when an article has one or more evaluations', () => {
    it.todo('returns the activity for that article');
  });
});
