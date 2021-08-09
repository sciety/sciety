import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { extractPrelights } from '../../../src/ingest/prelights/extract-prelights';
import { arbitraryDate, arbitraryWord } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';

describe('extract-prelights', () => {
  describe('given an item that is not a highlight', () => {
    const guid = arbitraryWord();
    const fetchData = shouldNotBeCalled;
    const result = pipe(
      [{
        guid,
        category: '<a name = "something">something</a>',
        pubDate: arbitraryDate(),
        preprintUrl: arbitraryWord(),
      }],
      extractPrelights(fetchData),
    );

    it('records no evaluations', async () => {
      expect(await result()).toStrictEqual(expect.objectContaining({
        evaluations: [],
      }));
    });

    it('records the item as skipped', async () => {
      expect(await result()).toStrictEqual(expect.objectContaining({
        skippedItems: O.some([expect.objectContaining({
          item: guid,
        })]),
      }));
    });
  });
});
