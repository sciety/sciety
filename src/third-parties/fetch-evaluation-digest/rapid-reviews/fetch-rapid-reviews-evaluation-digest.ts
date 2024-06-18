import { CheerioAPI, load } from 'cheerio';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../../../logger';
import * as DE from '../../../types/data-error';
import { toHtmlFragment } from '../../../types/html-fragment';
import { sanitise } from '../../../types/sanitised-html-fragment';
import { QueryExternalService } from '../../query-external-service';
import { EvaluationDigestFetcher } from '../evaluation-digest-fetcher';

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
    ${pipe(creator, O.match(constant(''), (txt) => `<h3>${txt}</h3>`))}
    ${pipe(title, O.match(constant(''), (txt) => `<p>${txt}</p>`))}
    ${pipe(description, O.match(constant(''), (txt) => `<p>${txt}</p>`))}
  `,
  E.right,
);

const extractEvaluationDigest = (logger: Logger) => (html: string) => {
  const parsedDocument = load(html);
  if (parsedDocument('meta[name="dc.title"]').attr('content')?.startsWith('Reviews of ')) {
    return summary(logger)(parsedDocument);
  }
  return review(parsedDocument);
};

export const fetchRapidReviewsEvaluationDigest = (
  queryExternalService: QueryExternalService,
  logger: Logger,
): EvaluationDigestFetcher => (url) => pipe(
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
    extractEvaluationDigest(logger),
    E.map(toHtmlFragment),
    E.map(sanitise),
  )),
);
