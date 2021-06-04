import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from './fetch-review';
import { toHtmlFragment } from '../types/html-fragment';

type GetHtml = (url: string) => TE.TaskEither<'unavailable', string>;

export const fetchPrelightsHighlight = (getHtml: GetHtml): EvaluationFetcher => (key: string) => pipe(
  getHtml(key),
  TE.map(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelectorAll('meta[property="og:description"]')[2],
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    O.getOrElse(constant('')),
    toHtmlFragment,
  )),
  TE.map((text) => ({
    url: new URL(key),
    fullText: text,
  })),
);
