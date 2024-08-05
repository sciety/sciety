import { pipe } from 'fp-ts/function';
import { extractPrelights } from '../../../../src/ingest/evaluation-discovery/discover-prelights-evaluations/extract-prelights';
import { constructPublishedEvaluation } from '../../../../src/ingest/types/published-evaluation';
import {
  arbitraryDate, arbitraryNumber, arbitraryString, arbitraryWord,
} from '../../../helpers';

describe('extract-prelights', () => {
  describe('given a valid evaluation with a preprintDoi', () => {
    const postNumber = arbitraryNumber(1000, 100000);
    const pubDate = arbitraryDate();
    const preprintDoi = `10.1101/${arbitraryWord()}`;
    const author = `${arbitraryString()}, ${arbitraryString()}`;
    const result = pipe(
      [{
        guid: `https://prelights.biologists.com/?post_type=highlight&#038;p=${postNumber}`,
        category: '<a name = "highlight">highlight</a>',
        pubDate,
        preprintDoi,
        author,
      }],
      extractPrelights,
    );

    it('records the evaluation', () => {
      const expectedEvaluation = constructPublishedEvaluation({
        publishedOn: pubDate,
        paperExpressionDoi: preprintDoi,
        evaluationLocator: `prelights:https://prelights.biologists.com/?post_type=highlight&p=${postNumber}`,
        authors: [author],
      });

      expect(result).toStrictEqual({
        understood: [
          expectedEvaluation,
        ],
        skipped: [],
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
      expect(result.understood).toHaveLength(0);
    });

    it('skips the evaluation', () => {
      expect(result.skipped[0].item).toStrictEqual(guid);
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
      expect(result.understood).toHaveLength(0);
    });

    it('skips the evaluation', () => {
      expect(result.skipped[0].item).toStrictEqual(guid);
    });
  });

  describe('when the preprint is not on biorxiv or medrxiv', () => {
    const guid = arbitraryWord();
    const result = pipe(
      [{
        guid,
        category: '<a name = "highlight">highlight</a>',
        pubDate: arbitraryDate(),
        preprintDoi: `10.1234/${arbitraryWord()}`,
        author: arbitraryString(),
      }],
      extractPrelights,
    );

    it('records no evaluations', () => {
      expect(result.understood).toHaveLength(0);
    });

    it('skips the evaluation', () => {
      expect(result.skipped[0].item).toStrictEqual(guid);
    });
  });
});
