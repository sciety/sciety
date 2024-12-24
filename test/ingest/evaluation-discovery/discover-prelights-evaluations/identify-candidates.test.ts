import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { identifyCandidates } from '../../../../src/ingest/evaluation-discovery/discover-prelights-evaluations/identify-candidates';
import { abortTest } from '../../../abort-test';
import { arbitraryDate, arbitraryString, arbitraryUri } from '../../../helpers';

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

  describe('when highlights are not linked to a preprint', () => {
    it('decodes three candidates', () => {
      const inputCausingCodecFailure = `
        <rss version="2.0">
          <channel>
            <title>preLights</title>
            <item>
              <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
              <title>Restoring mechanophenotype reverts malignant properties of ECM-enriched vocal fold cancer</title>
              <guid isPermaLink="false">https://prelights.biologists.com/?post_type=highlight&#038;p=39236</guid>
              <author>Teodora Piskova</author>
              <pubDate>Thu, 19 Dec 2024 11:33:37 +0000</pubDate>
              <preprints>
                  <preprint>
                    <preprintdoi>10.1101/2024.08.22.609159</preprintdoi>
                  </preprint>
              </preprints>
            </item>
            <item>
              <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
              <title>Phosphorylation of huntingtin at S421 supercharges cellular transport by turbocharging kinesin and dynein motors on endosomes and lysosomes</title>
              <guid isPermaLink="false">https://prelights.biologists.com/?post_type=highlight&#038;p=39265</guid>
              <author>Abhishek Poddar</author>
              <pubDate>Wed, 21 Aug 2024 06:25:53 +0000</pubDate>
              <doi>https://doi.org/10.1242/prelights.39265</doi>
            </item>
            <item>
              <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
              <title>Necrosulfonamide causes oxidation of PCM1 and impairs ciliogenesis and autophagy</title>
              <guid isPermaLink="false">https://prelights.biologists.com/?post_type=highlight&#038;p=39257</guid>
              <author>Abhishek Poddar</author>
              <pubDate>Tue, 19 Mar 2024 07:00:46 +0000</pubDate>
              <doi>https://doi.org/10.1242/prelights.39257</doi>
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
