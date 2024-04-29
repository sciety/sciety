import { pipe } from 'fp-ts/function';
import { extractPrelights } from '../../../src/ingest/third-parties/prelights/extract-prelights';
import { constructEvaluation } from '../../../src/ingest/types/evaluations';
import {
  arbitraryDate, arbitraryNumber, arbitraryString, arbitraryWord,
} from '../../helpers';
import { arbitraryArticleId } from '../../types/article-id.helper';

describe('extract-prelights', () => {
  describe('given a valid evaluation with a preprintDoi', () => {
    const postNumber = arbitraryNumber(1000, 100000);
    const pubDate = arbitraryDate();
    const preprintDoi = arbitraryArticleId('10.1101');
    const author = `${arbitraryString()}, ${arbitraryString()}`;
    const result = pipe(
      [{
        guid: `https://prelights.biologists.com/?post_type=highlight&#038;p=${postNumber}`,
        category: '<a name = "highlight">highlight</a>',
        pubDate,
        preprintDoi: preprintDoi.value,
        author,
      }],
      extractPrelights,
    );

    it('records the evaluation', () => {
      const expectedEvaluation = constructEvaluation({
        publishedOn: pubDate,
        paperExpressionDoi: preprintDoi.value,
        evaluationLocator: `prelights:https://prelights.biologists.com/?post_type=highlight&p=${postNumber}`,
        authors: [author],
      });

      expect(result).toStrictEqual({
        evaluations: [
          expectedEvaluation,
        ],
        skippedItems: [],
      });
    });
  });

  describe('given a valid evaluation without a preprintDoi', () => {
    const guid = arbitraryWord();
    const pubDate = arbitraryDate();
    const author = arbitraryString();
    const result = pipe(
      [{
        guid,
        category: '<a name = "highlight">highlight</a>',
        pubDate,
        preprintDoi: '',
        author,
      }],
      extractPrelights,
    );

    it('records no evaluations', () => {
      expect(result.evaluations).toHaveLength(0);
    });

    it('skips the evaluation', () => {
      expect(result.skippedItems[0].item).toStrictEqual(guid);
    });
  });

  describe('given an item that is not a highlight', () => {
    const guid = arbitraryWord();
    const result = pipe(
      [{
        guid,
        category: '<a name = "something">something</a>',
        pubDate: arbitraryDate(),
        preprintDoi: arbitraryString(),
        author: arbitraryString(),
      }],
      extractPrelights,
    );

    it('records no evaluations', () => {
      expect(result.evaluations).toHaveLength(0);
    });

    it('skips the evaluation', () => {
      expect(result.skippedItems[0].item).toStrictEqual(guid);
    });
  });

  describe('when the preprint is not on biorxiv or medrxiv', () => {
    const guid = arbitraryWord();
    const result = pipe(
      [{
        guid,
        category: '<a name = "highlight">highlight</a>',
        pubDate: arbitraryDate(),
        preprintDoi: arbitraryArticleId('10.1234').value,
        author: arbitraryString(),
      }],
      extractPrelights,
    );

    it('records no evaluations', () => {
      expect(result.evaluations).toHaveLength(0);
    });

    it('skips the evaluation', () => {
      expect(result.skippedItems[0].item).toStrictEqual(guid);
    });
  });
});
