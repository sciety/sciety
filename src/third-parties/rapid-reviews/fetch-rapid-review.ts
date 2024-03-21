import { URL } from 'url';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { CheerioAPI, load } from 'cheerio';
import { QueryExternalService } from '../query-external-service.js';
import { EvaluationFetcher } from '../evaluation-fetcher.js';
import * as DE from '../../types/data-error.js';
import { toHtmlFragment } from '../../types/html-fragment.js';
import { sanitise } from '../../types/sanitised-html-fragment.js';
import { Logger } from '../../infrastructure/index.js';

const summary = (logger: Logger) => (doc: CheerioAPI) => pipe(
  doc('meta[name=description]').attr()?.content,
  O.fromNullable,
  E.fromOption(() => DE.notFound),
  E.bimap(
    (err) => {
      logger('error', 'Rapid-review summary has no description');
      return err;
    },
    flow(
      (text) => text.replace(/•/g, '<br>'),
      (description) => `
      <h3>Strength of evidence</h3>
      <p>${description}</p>
      `,
    ),
  ),
);

const review = (doc: CheerioAPI) => pipe(
  {
    creator: O.fromNullable(doc('meta[name="dc.creator"]').map((i, element) => doc(element).attr('content')).get().join(', ')),
    title: O.fromNullable(doc('meta[name="dc.title"]').attr('content')),
    description: O.fromNullable(doc('meta[name=description]').attr('content')),
  },
  ({ description, creator, title }) => `
    ${pipe(creator, O.fold(constant(''), (txt) => `<h3>${txt}</h3>`))}
    ${pipe(title, O.fold(constant(''), (txt) => `<p>${txt}</p>`))}
    ${pipe(description, O.fold(constant(''), (txt) => `<p>${txt}</p>`))}
  `,
  E.right,
);

const extractEvaluation = (logger: Logger) => (html: string) => {
  const parsedDocument = load(html);
  if (parsedDocument('meta[name="dc.title"]').attr('content')?.startsWith('Reviews of ')) {
    return summary(logger)(parsedDocument);
  }
  return review(parsedDocument);
};

export const fetchRapidReview = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationFetcher => (url) => pipe(
  url,
  queryExternalService(),
  TE.chainEitherKW(flow(
    t.string.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => {
      logger('error', 'RapidReviews response is not a string', { errors, url });
      return DE.unavailable;
    }),
  )),
  TE.chainEitherKW(flow(
    extractEvaluation(logger),
    E.map(toHtmlFragment),
    E.map(sanitise),
  )),
  TE.map((fullText) => ({
    fullText,
    url: new URL(url),
  })),
);
