import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from './fetch-review';
import { toHtmlFragment } from '../types/html-fragment';

type GetHtml = (url: string) => TE.TaskEither<'unavailable', string>;

export const fetchRapidReview = (getHtml: GetHtml): EvaluationFetcher => (key) => pipe(
  key,
  getHtml,
  TE.map(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[name=description]'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    O.getOrElse(constant('')),
    toHtmlFragment,
  )),
  TE.map((fullText) => ({
    fullText,
    url: new URL(key),
  })),
);
