import { URL } from 'url';
import * as E from 'fp-ts/Either';
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
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => ({
      creator: O.fromNullable(dom.window.document.querySelector('meta[name="dc.creator"]')?.getAttribute('content')),
      title: O.fromNullable(dom.window.document.querySelector('meta[name="dc.title"]')?.getAttribute('content')),
      description: O.fromNullable(dom.window.document.querySelector('meta[name=description]')?.getAttribute('content')),
    }),
    ({ description, creator, title }) => `
      ${pipe(creator, O.fold(constant(''), (txt) => `<h3>${txt}</h3>`))}
      ${pipe(title, O.fold(constant(''), (txt) => `<p>${txt}</p>`))}
      ${pipe(description, O.fold(constant(''), (txt) => `<p>${txt}</p>`))}
    `,
    E.right,
    E.map(toHtmlFragment),
  )),
  TE.map((fullText) => ({
    fullText,
    url: new URL(key),
  })),
);
