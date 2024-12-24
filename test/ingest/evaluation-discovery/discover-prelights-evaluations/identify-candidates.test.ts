import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { identifyCandidates } from '../../../../src/ingest/evaluation-discovery/discover-prelights-evaluations/identify-candidates';
import { abortTest } from '../../../abort-test';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';

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

  describe('when feed containes items that are not linked to a preprint', () => {
    it('decodes them as candidates', () => {
      const inputCausingCodecFailure = `
        <rss version="2.0">
          <channel>
            <title>preLights</title>
            <item>
              <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
              <title>${arbitraryString()}</title>
              <guid isPermaLink="false">${arbitraryUri()}</guid>
              <author>${arbitraryString()}</author>
              <pubDate>${arbitraryDate().toISOString()}</pubDate>
              <preprints>
                  <preprint>
                    <preprintdoi>${arbitraryExpressionDoi()}</preprintdoi>
                  </preprint>
              </preprints>
            </item>
            <item>
              <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
              <title>${arbitraryString()}</title>
              <guid isPermaLink="false">${arbitraryUri()}</guid>
              <author>${arbitraryString()}</author>
              <pubDate>${arbitraryDate().toISOString()}</pubDate>
              <doi>${arbitraryExpressionDoi()}</doi>
            </item>
            <item>
              <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
              <title>${arbitraryString()}</title>
              <guid isPermaLink="false">${arbitraryUri()}</guid>
              <author>${arbitraryString()}</author>
              <pubDate>${arbitraryDate().toISOString()}</pubDate>
              <doi>${arbitraryExpressionDoi()}</doi>
            </item>
          </channel>
        </rss>
      `;

      const result = pipe(
        inputCausingCodecFailure,
        identifyCandidates,
        E.getOrElseW(abortTest('expected result to be on the right')),
      );

      expect(result).toHaveLength(3);
    });
  });
});
