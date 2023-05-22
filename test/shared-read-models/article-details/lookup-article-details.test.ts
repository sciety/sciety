import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryArticleId } from '../../types/article-id.helper';
import { handleEvent, initialState } from '../../../src/shared-read-models/article-details';
import { lookupArticleDetails } from '../../../src/shared-read-models/article-details/lookup-article-details';
import { arbitraryHtmlFragment, arbitraryWord } from '../../helpers';
import { arbitraryArticleServer } from '../../types/article-server.helper';
import { constructEvent } from '../../../src/domain-events';

const arbitraryArticleDetails = (articleId = arbitraryArticleId()) => ({
  doi: articleId,
  abstract: arbitraryHtmlFragment(),
  authors: [arbitraryWord(), arbitraryWord()],
  title: arbitraryHtmlFragment(),
  server: arbitraryArticleServer(),
});

describe('lookup-article-details', () => {
  const articleId = arbitraryArticleId();

  describe('when no details have been recorded', () => {
    const readmodel = pipe(
      [],
      RA.reduce(initialState(), handleEvent),
    );

    it('returns None', () => {
      expect(lookupArticleDetails(readmodel)(articleId)).toStrictEqual(O.none);
    });
  });

  describe('when details have been recorded', () => {
    const details = arbitraryArticleDetails(articleId);
    const readmodel = pipe(
      [
        constructEvent('ArticleDetailsRecorded')(details),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns the details', () => {
      expect(lookupArticleDetails(readmodel)(articleId)).toStrictEqual(details);
    });
  });

  describe('when newer details have been recorded', () => {
    const oldDetails = arbitraryArticleDetails(articleId);
    const newDetails = arbitraryArticleDetails(articleId);
    const readmodel = pipe(
      [
        constructEvent('ArticleDetailsRecorded')(oldDetails),
        constructEvent('ArticleDetailsRecorded')(newDetails),
      ],
      RA.reduce(initialState(), handleEvent),
    );

    it.failing('returns the details', () => {
      expect(lookupArticleDetails(readmodel)(articleId)).toStrictEqual(newDetails);
    });
  });
});
