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

  describe('reproduce production issue', () => {
    it.failing('decodes three candidates', () => {
      const inputCausingCodecFailure = `
        <?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0"
          xmlns:content="http://purl.org/rss/1.0/modules/content/"
          xmlns:wfw="http://wellformedweb.org/CommentAPI/"
          xmlns:dc="http://purl.org/dc/elements/1.1/"
          xmlns:atom="http://www.w3.org/2005/Atom"
          xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
          xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
          xmlns:georss="http://www.georss.org/georss"
          xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
          >

          <!-- RSS feed defaults -->
          <channel>
            <title>preLights</title>
            <link>https://prelights.biologists.com/</link>

            <lastBuildDate>Mon, 23 Dec 2024 07:34:06 +0000</lastBuildDate>
            <language>en-GB</language>
            <sy:updatePeriod>hourly</sy:updatePeriod>
            <sy:updateFrequency>1</sy:updateFrequency>
            <atom:link href="https://prelights.biologists.com/feed/sciety/?key=trdvKJGc342dbfurvtvwsv5y&#038;hours=120" rel="self" type="application/rss+xml" />

            <!-- Feed Logo (optional) -->
            <image>
              <url>https://prelights.biologists.com//dist/images/preLights.svg</url>
              <title>Preprint highlights, selected by the biological community</title>
              <link>https://prelights.biologists.com/</link>
            </image>

            <generator>https://wordpress.org/?v=6.6.2</generator>
        <site xmlns="com-wordpress:feed-additions:1">143028432</site>
            <!-- Start loop -->
                  <item>
                  <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
                  <title>Restoring mechanophenotype reverts malignant properties of ECM-enriched vocal fold cancer</title>
                  <link>https://prelights.biologists.com/highlights/restoring-mechanophenotype-reverts-malignant-properties-of-ecm-enriched-vocal-fold-cancer/</link>
                  <guid isPermaLink="false">https://prelights.biologists.com/?post_type=highlight&#038;p=39236</guid>
                  <author>Teodora Piskova</author>
                  <image>
                    <url>https://prelights.biologists.com/wp-content/uploads/2024/12/Unbenannt.png</url>
                  </image>
                  <pubDate>Thu, 19 Dec 2024 11:33:37 +0000</pubDate>

                  <!-- Echo content and related posts -->
                  <oneLineSummary>Can restoring vocal fold mechanics combat cancer? This preprint explores how!</oneLineSummary>
                  <content:encoded>
                    <![CDATA[<h3><strong>Introduction</strong></h3> The extracellular matrix (ECM) drives cancer progression (1), but most relevant studies focus solely on solid tumours where cells are not exposed to significant forces. Unlike most cancers, vocal fold cancer (VFC) develops in a tissue that constantly experiences mechanical stress (in this case, from speaking and breathing). VFC&hellip;]]>
                  </content:encoded>
                  <doi></doi>

                  <!-- Links to Biorxiv-->
                  <preprints>
                      <preprint>
                        <preprinturl>https://www.biorxiv.org/content/10.1101/2024.08.22.609159v1</preprinturl>
                        <preprintdoi>10.1101/2024.08.22.609159</preprintdoi>
                        <preprintauthorresponse>No</preprintauthorresponse>
                        <preprintauthorresponseurl></preprintauthorresponseurl>
                        <preprintauthorresponseexcerpt>
                          <![CDATA[]]>
                        </preprintauthorresponseexcerpt>
                      </preprint>
                  </preprints>
                        </item>
                    <item>
                  <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
                  <title>Phosphorylation of huntingtin at S421 supercharges cellular transport by turbocharging kinesin and dynein motors on endosomes and lysosomes</title>
                  <link>https://prelights.biologists.com/highlights/phosphorylation-of-huntingtin-at-s421-supercharges-cellular-transport-by-turbocharging-kinesin-and-dynein-motors-on-endosomes-and-lysosomes/</link>
                  <guid isPermaLink="false">https://prelights.biologists.com/?post_type=highlight&#038;p=39265</guid>
                  <author>Abhishek Poddar</author>
                  <image>
                    <url></url>
                  </image>
                  <pubDate>Wed, 21 Aug 2024 06:25:53 +0000</pubDate>

                  <!-- Echo content and related posts -->
                  <oneLineSummary>Phosphorylation Power: Unlocking Huntingtin&#039;s Role in Enhancing Intracellular Transport</oneLineSummary>
                  <content:encoded>
                    <![CDATA[<h4><strong>Background </strong></h4> This study explores how the phosphorylation of huntingtin at the S421 site influences intracellular transport of early endosomes and lysosomes. The findings reveal that cells expressing endogenous levels of phosphomimetic huntingtin (HTT-S421D) exhibit enhanced transport activity, with lysosomes traveling longer distances and a greater fraction of them displaying&hellip;]]>
                  </content:encoded>
                  <doi>https://doi.org/10.1242/prelights.39265</doi>

                  <!-- Links to Biorxiv-->
                        </item>
                    <item>
                  <category><![CDATA[<a name = "highlight">highlight</a>]]></category>
                  <title>Necrosulfonamide causes oxidation of PCM1 and impairs ciliogenesis and autophagy</title>
                  <link>https://prelights.biologists.com/highlights/necrosulfonamide-causes-oxidation-of-pcm1-and-impairs-ciliogenesis-and-autophagy/</link>
                  <guid isPermaLink="false">https://prelights.biologists.com/?post_type=highlight&#038;p=39257</guid>
                  <author>Abhishek Poddar</author>
                  <image>
                    <url></url>
                  </image>
                  <pubDate>Tue, 19 Mar 2024 07:00:46 +0000</pubDate>

                  <!-- Echo content and related posts -->
                  <oneLineSummary>Necrosulfonamide disrupts ciliogenesis and autophagy by inducing PCM1 oxidation and aggregation via ROS production, independent of MLKL.</oneLineSummary>
                  <content:encoded>
                    <![CDATA[<h4>Background:</h4> Centriolar satellites are small, protein assemblies located near centrioles in animal cells. They play a key role in cellular processes such as centriole duplication, ciliogenesis (formation of primary cilium), autophagy and regulation of microtubule dynamics. PCM1 (pericentriolar material 1) is a key component of the centriolar satellites which serves&hellip;]]>
                  </content:encoded>
                  <doi>https://doi.org/10.1242/prelights.39257</doi>

                  <!-- Links to Biorxiv-->
                        </item>
                    <!-- End loop -->
                    <description>Preprint highlights, selected by the biological community Feed</description>
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
