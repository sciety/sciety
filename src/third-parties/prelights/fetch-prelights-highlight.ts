import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from '../fetch-review';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { sanitise } from '../../types/sanitised-html-fragment';
import { Logger } from '../../shared-ports';

type GetHtml = (url: string) => TE.TaskEither<unknown, string>;

export const fetchPrelightsHighlight = (logger: Logger, getHtml: GetHtml): EvaluationFetcher => (key: string) => pipe(
  getHtml(key),
  TE.mapLeft((error) => {
    logger('error', 'Failed to get HTML', { key, error });
    return DE.unavailable;
  }),
  TE.chainEitherKW(flow(
    (doc) => new JSDOM(doc),
    (dom) => dom.window.document.querySelector('meta[property="og:description"]:not([content=""])'),
    (meta) => meta?.getAttribute('content'),
    O.fromNullable,
    E.fromOption(() => DE.unavailable),
    E.map((text) => `<h3>Excerpt</h3><p>${text}</p>`),
    E.map(toHtmlFragment),
    E.map(sanitise),
  )),
  TE.map((text) => ({
    url: new URL(key),
    fullText: text,
  })),
);
