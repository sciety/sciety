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
        const preprintUrl = arbitraryUri();
        const result = identifyCandidates(`
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
          <channel>
            <item>
              <category>${category}</category>
              <guid isPermaLink="false">${guid}</guid>
              <pubDate>${pubDate.toISOString()}</pubDate>
              <preprints>
                <preprint>
                  <preprinturl>${preprintUrl}</preprinturl>
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
            pubDate,
            preprintUrl,
          },
        ]));
      });
    });

    describe('referring to two preprints', () => {
      it('identifies two candidate evaluations', () => {
        const category = arbitraryString();
        const pubDate = arbitraryDate();
        const guid = arbitraryUri();
        const preprintUrl1 = arbitraryUri();
        const preprintUrl2 = arbitraryUri();
        const result = identifyCandidates(`
          <?xml version="1.0" encoding="UTF-8"?>
          <rss version="2.0">
          <channel>
            <item>
              <category>${category}</category>
              <guid isPermaLink="false">${guid}</guid>
              <pubDate>${pubDate.toISOString()}</pubDate>
              <preprints>
                <preprint>
                  <preprinturl>${preprintUrl1}</preprinturl>
                </preprint>
                <preprint>
                  <preprinturl>${preprintUrl2}</preprinturl>
                </preprint>
              </preprints>
              </item>
            </channel>
          </rss>
        `);

        expect(result).toStrictEqual(E.right([
          {
            category, guid, pubDate, preprintUrl: preprintUrl1,
          },
          {
            category, guid, pubDate, preprintUrl: preprintUrl2,
          },
        ]));
      });
    });
  });

  describe('when the feed is empty', () => {
    it.todo('identifies no candidate evaluations');
  });
});
