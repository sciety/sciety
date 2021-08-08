import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchPrelightsEvaluations } from '../../src/ingest/fetch-prelights-evaluations';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('fetch-prelights-evaluations', () => {
  describe('when the feed contains a highlight ...', () => {
    describe('referring to a single preprint', () => {
      it.todo('records the highlight as an evaluation');

      it.todo('records no skipped items');
    });

    describe('referring to two preprints', () => {
      it.todo('records the highlight as two evaluations');

      it.todo('records no skipped items');
    });

    describe('referring to an article that is not on biorxiv', () => {
      it.todo('records no evaluations');

      it.todo('records the item as skipped');
    });
  });

  describe('when the feed contains an item that is not a highlight', () => {
    const guid = arbitraryWord();
    const xml = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" >
        <channel>
          <item>
            <category><![CDATA[<a name = "something">something</a>]]></category>
            <guid isPermaLink="false">${guid}</guid>
            <pubDate>Thu, 05 Aug 2021 23:05:29 +0000</pubDate>
            <preprints>
              <preprint>
                <preprinturl>https://www.biorxiv.org/content/10.1101/2021.07.13.452203v1</preprinturl>
              </preprint>
            </preprints>
          </item>
        </channel>
      </rss>
    `;
    const result = pipe(
      {
        fetchGoogleSheet: shouldNotBeCalled,
        fetchData: <D>() => TE.right(xml) as unknown as D,
      },
      fetchPrelightsEvaluations(),
    );

    it('records no evaluations', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [],
      })));
    });

    it('records the item as skipped', async () => {
      expect(await result()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: O.some([expect.objectContaining({
          item: guid,
        })]),
      })));
    });
  });

  describe('when the feed is empty', () => {
    it.todo('records no evaluations');

    it.todo('records no skipped items');
  });
});
