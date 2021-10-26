import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from '../../../src/ingest/prelights/extract-prelights';
import {
  arbitraryDate, arbitraryNumber, arbitraryString, arbitraryWord,
} from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryDoi } from '../../types/doi.helper';

describe('extract-prelights', () => {
  describe('given a valid evaluation', () => {
    const guid = `https://prelights.biologists.com/?post_type=highlight&p=${arbitraryNumber(1000, 100000)}`;
    const pubDate = arbitraryDate();
    const preprintDoi = arbitraryDoi('10.1101');
    const fetchData = () => TE.right(`<meta name="DC.Identifier" content="${preprintDoi.value}" />`);
    const result = pipe(
      [{
        guid,
        category: '<a name = "highlight">highlight</a>',
        pubDate,
        preprintUrl: arbitraryWord(),
        author: arbitraryString(),
      }],
      extractPrelights(fetchData),
    );

    it('records the evaluation', async () => {
      expect(await result()).toStrictEqual(expect.objectContaining({
        evaluations: [
          {
            date: pubDate,
            articleDoi: preprintDoi.value,
            evaluationLocator: `prelights:${guid}`,
          },
        ],
        skippedItems: [],
      }));
    });
  });

  describe('given an item that is not a highlight', () => {
    const guid = arbitraryWord();
    const fetchData = shouldNotBeCalled;
    const result = pipe(
      [{
        guid,
        category: '<a name = "something">something</a>',
        pubDate: arbitraryDate(),
        preprintUrl: arbitraryWord(),
        author: arbitraryString(),
      }],
      extractPrelights(fetchData),
    );

    it('skips the item', async () => {
      expect(await result()).toStrictEqual(expect.objectContaining({
        evaluations: [],
        skippedItems: [expect.objectContaining({
          item: guid,
        })],
      }));
    });
  });

  describe('when the preprint does not exist', () => {
    it.todo('skips the item');
  });

  describe('when the preprint does not have a DC.Identifier', () => {
    it.todo('skips the item');
  });

  describe('when the preprint is not on a supported server', () => {
    it.todo('skips the item');
  });
});
