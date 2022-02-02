import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from '../../infrastructure/fetch-review';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';

type GetHtml = (url: string) => TE.TaskEither<DE.DataError, string>;

export const fetchPrelightsHighlight = (getHtml: GetHtml): EvaluationFetcher => (key: string) => pipe(
  getHtml(key),
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[property="og:description"]:not([content=""])'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(() => DE.unavailable),
    E.map((text) => `<h3>Excerpt</h3><p>${text}</p>`),
    E.map(toHtmlFragment),
  )),
  TE.map((text) => ({
    url: new URL(key),
    fullText: text,
  })),
);
