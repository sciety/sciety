import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from './fetch-review';
import { toHtmlFragment } from '../types/html-fragment';

type GetHtml = (url: string) => TE.TaskEither<'unavailable', string>;

export const fetchPrelightsHighlight = (getHtml: GetHtml): EvaluationFetcher => (key: string) => pipe(
  getHtml(key),
  TE.chainEitherK(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[property="og:description"]:not([content=""])'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(constant('unavailable' as const)),
    E.map((text) => `<h3>Excerpt</h3><p>${text}</p>`),
    E.map(toHtmlFragment),
  )),
  TE.map((text) => ({
    url: new URL(key),
    fullText: text,
  })),
);
