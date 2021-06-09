import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from './fetch-review';
import { toHtmlFragment } from '../types/html-fragment';

const hardcodedHtml = `
<!DOCTYPE html>
<html lang="en" data-reactroot="">
<head>
    <meta charSet="utf-8"/>
    <link rel="alternate" type="application/rss+xml"
          title="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot; RSS Feed"
          href="https://rapidreviewscovid19.mitpress.mit.edu/rss.xml"/>
    <title>Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot; ·
        Rapid Reviews COVID-19</title>
    <meta property="og:title"
          content="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot; · Rapid Reviews COVID-19"/>
    <meta name="twitter:title"
          content="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot; · Rapid Reviews COVID-19"/>
    <meta name="twitter:image:alt"
          content="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot; · Rapid Reviews COVID-19"/>
    <meta name="citation_title"
          content="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot;"/>
    <meta name="dc.title"
          content="Review 1: &quot;Differential effects of antiseptic mouth rinses on SARS-CoV-2 infectivity in vitro&quot;"/>
    <meta property="og:site_name" content="Rapid Reviews COVID-19"/>
    <meta name="citation_journal_title" content="Rapid Reviews COVID-19"/>
    <meta property="og:url" content="https://rapidreviewscovid19.mitpress.mit.edu/pub/qif9azz9/release/1"/>
    <meta property="og:type" content="article"/>
    <meta name="citation_pdf_url" content="https://rapidreviewscovid19.mitpress.mit.edu/pub/qif9azz9/download/pdf"/>
    <meta name="description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta property="og:description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta name="twitter:description"
          content="This potentially informative in-vitro study finds that some commercially available mouth-rinses have different anti-viral activity/cytotoxicity. Additional animal models and clinical trials are needed to generalize the study’s findings."/>
    <meta property="og:image" content="https://assets.pubpub.org/wndps5rf/01612000970392.jpg"/>
    <meta property="og:image:url" content="https://assets.pubpub.org/wndps5rf/01612000970392.jpg"/>
    <meta property="og:image:width" content="500"/>
    <meta name="twitter:image" content="https://assets.pubpub.org/wndps5rf/01612000970392.jpg"/>
    <meta name="citation_author" content="Florence Carrouel"/>
    <meta name="dc.creator" content="Florence Carrouel"/>
    <meta property="article:published_time" content="Sat Jan 30 2021 10:05:21 GMT+0000 (Coordinated Universal Time)"/>
    <meta property="dc.date" content="2021-0-30"/>
    <meta name="citation_publication_date" content="2021/1/30"/>
    <meta name="citation_publisher" content="PubPub"/>
    <meta property="dc.publisher" content="PubPub"/>
    <meta name="citation_doi" content="doi:10.1162/2e3983f5.85aec587"/>
    <meta property="dc.identifier" content="doi:10.1162/2e3983f5.85aec587"/>
    <meta property="prism.doi" content="doi:10.1162/2e3983f5.85aec587"/>
    <meta property="fb:app_id" content="924988584221879"/>
    <meta name="twitter:card" content="summary"/>
    <meta name="twitter:site" content="@pubpub"/>    
    <link rel="search" type="application/opensearchdescription+xml" title="Rapid Reviews COVID-19"
          href="/opensearch.xml"/>
</head>
</html>
`;

export const fetchRapidReview: EvaluationFetcher = (key) => TE.right({
  fullText: pipe(
    hardcodedHtml,
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[name=description]'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    O.getOrElse(constant('')),
    toHtmlFragment,
  ),
  url: new URL(key),
});
