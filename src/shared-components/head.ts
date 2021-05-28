import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { fathom, googleTagManager, intercom } from './analytics';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

export const head = (
  user: O.Option<User>,
  title: string,
  openGraph?: { title: string, description: string },
): HtmlFragment => toHtmlFragment(`
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>
    ${htmlEscape(title.startsWith('Sciety') ? title : `${title} | Sciety`)}
  </title>
  <link rel="stylesheet" href="/static/style.css">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@scietyHQ">
  <meta property="og:site_name" content="Sciety">
  <meta property="og:title" content="${htmlEscape(openGraph ? openGraph.title : 'Sciety')}">
  <meta property="og:description" content="${htmlEscape(openGraph ? openGraph.description : 'Let Sciety help you navigate the preprint landscape.')}">
  <meta property="og:image" content="${process.env.APP_ORIGIN ?? ''}/static/images/sciety-twitter-profile.png">
  <link rel="icon" type="image/svg+xml" href="/static/images/favicons/favicon.svg">

  <link rel="apple-touch-icon" sizes="180x180" href="/static/images/favicons/generated/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/static/images/favicons/generated/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/static/images/favicons/generated/favicon-16x16.png">
  <link rel="manifest" href="/static/images/favicons/generated/site.webmanifest">
  <link rel="mask-icon" href="/static/images/favicons/generated/safari-pinned-tab.svg" color="#cf4500">
  <link rel="shortcut icon" href="/static/images/favicons/generated/favicon.ico">
  <meta name="msapplication-TileColor" content="#cf4500">
  <meta name="msapplication-config" content="/static/images/favicons/generated/browserconfig.xml">
  <meta name="theme-color" content="#ffffff">

  ${googleTagManager(pipe(user, O.map((u) => u.id)))}
  ${fathom()}
  ${intercom()}
</head>
`);
