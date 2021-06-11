import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { JSDOM } from 'jsdom';
import { EvaluationFetcher } from './fetch-review';
import { Logger } from './logger';
import { toHtmlFragment } from '../types/html-fragment';

type GetHtml = (url: string) => TE.TaskEither<'unavailable', string>;

type LogMessages = ReadonlyArray<string>;

const summary = (doc: Document) => (): [E.Either<'not-found', string>, LogMessages] => pipe(
  doc.querySelector('meta[name=description]')?.getAttribute('content'),
  O.fromNullable,
  E.fromOption(constant('not-found' as const)),
  E.fold(
    (err) => [E.left(err), ['Rapid-review summary has no description']],
    (description) => [E.right(`
      <h3>Strength of evidence</h3>
      <p>${description}</p>
    `), []],
  ),
);

const review = (doc: Document) => pipe(
  {
    creator: O.fromNullable(Array.from(doc.querySelectorAll('meta[name="dc.creator"]')).map((creatorNode) => creatorNode.getAttribute('content')).join(', ')),
    title: O.fromNullable(doc.querySelector('meta[name="dc.title"]')?.getAttribute('content')),
    description: O.fromNullable(doc.querySelector('meta[name=description]')?.getAttribute('content')),
  },
  ({ description, creator, title }) => `
    ${pipe(creator, O.fold(constant(''), (txt) => `<h3>${txt}</h3>`))}
    ${pipe(title, O.fold(constant(''), (txt) => `<p>${txt}</p>`))}
    ${pipe(description, O.fold(constant(''), (txt) => `<p>${txt}</p>`))}
  `,
  E.right,
);

const extractEvaluation = (doc: Document) => (): [E.Either<'unavailable' | 'not-found', string>, LogMessages] => {
  if (doc.querySelector('meta[name="dc.title"]')?.getAttribute('content')?.startsWith('Reviews of ')) {
    return summary(doc)();
  }
  return [review(doc), []];
};

export const fetchRapidReview = (logger: Logger, getHtml: GetHtml): EvaluationFetcher => (key) => pipe(
  key,
  getHtml,
  TE.chainEitherKW(flow(
    (html) => new JSDOM(html).window.document,
    extractEvaluation,
    (errorWriter) => {
      const [value, logMessages] = errorWriter();
      logMessages.forEach((logMessage) => logger('error', logMessage));
      return value;
    },
    E.map(toHtmlFragment),
  )),
  TE.map((fullText) => ({
    fullText,
    url: new URL(key),
  })),
);
