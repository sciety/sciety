import * as E from 'fp-ts/Either';
import { identifyCandidates } from '../../../src/ingest/prelights/identify-candidates';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../helpers';

describe('identify-candidates', () => {
  describe('when the feed contains an item ...', () => {
    describe('referring to a single preprint', () => {
      it('identifies a single candidate evaluation', () => {
        const category = arbitraryString();
        const pubDate = arbitraryDate();
        const guid = arbitraryUri();
        const preprintDoi = arbitraryString();
        const author = arbitraryString();
        const result = identifyCandidates(`
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
          <channel>
            <title>preLights</title>
            <item>
              <category>${category}</category>
              <guid isPermaLink="false">${guid}</guid>
              <author>${author}</author>
              <pubDate>${pubDate.toISOString()}</pubDate>
              <preprints>
                <preprint>
                  <preprintdoi>${preprintDoi}</preprintdoi>
                </preprint>
              </preprints>
              </item>
            </channel>
          </rss>
        `);

        expect(result).toStrictEqual(E.right([
          {
            category,
            guid,
            author,
            pubDate,
            preprintDoi,
          },
        ]));
      });
    });

    describe('referring to two preprints', () => {
      it('identifies two candidate evaluations', () => {
        const category = arbitraryString();
        const pubDate = arbitraryDate();
        const guid = arbitraryUri();
        const author = arbitraryString();
        const preprintDoi1 = arbitraryString();
        const preprintDoi2 = arbitraryString();
        const result = identifyCandidates(`
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
          <channel>
            <title>preLights</title>
            <item>
              <category>${category}</category>
              <guid isPermaLink="false">${guid}</guid>
              <author>${author}</author>
              <pubDate>${pubDate.toISOString()}</pubDate>
              <preprints>
                <preprint>
                  <preprintdoi>${preprintDoi1}</preprintdoi>
                </preprint>
                <preprint>
                  <preprintdoi>${preprintDoi2}</preprintdoi>
                </preprint>
              </preprints>
              </item>
            </channel>
          </rss>
        `);

        expect(result).toStrictEqual(E.right([
          {
            category, guid, pubDate, preprintDoi: preprintDoi1, author,
          },
          {
            category, guid, pubDate, preprintDoi: preprintDoi2, author,
          },
        ]));
      });
    });
  });

  describe('when the feed is empty', () => {
    it('identifies no candidate evaluations', () => {
      const result = identifyCandidates(`
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
          <channel>
            <title>preLights</title>
          </channel>
        </rss>
      `);

      expect(result).toStrictEqual(E.right([]));
    });
  });
});
