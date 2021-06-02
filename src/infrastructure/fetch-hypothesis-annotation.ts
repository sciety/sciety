import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { hypothesisAnnotation, HypothesisAnnotation } from './codecs/HypothesisAnnotation';
import { Logger } from './logger';
import { Review } from './review';
import { toHtmlFragment } from '../types/html-fragment';

type GetJson = (uri: string) => Promise<Json>;

const converter = new Remarkable({ html: true }).use(linkify);

const toReview = (logger: Logger) => (response: HypothesisAnnotation) => {
  const review: Review = {
    fullText: pipe(
      response.text,
      (text) => converter.render(text),
      toHtmlFragment,
    ),
    url: new URL(response.links.incontext),
  };
  logger('debug', 'Retrieved review', { ...review, fullText: '[text]' });
  return review;
};

export type FetchHypothesisAnnotation = (key: string) => TE.TaskEither<'unavailable', Review>;

export const fetchHypothesisAnnotation = (getJson: GetJson, logger: Logger): FetchHypothesisAnnotation => (key) => {
  const uri = `https://api.hypothes.is/api/annotations/${key}`;
  logger('debug', 'Fetching review from Hypothesis', { uri });
  return pipe(
    TE.tryCatch(
      async () => getJson(uri),
      (error) => {
        logger('error', 'Failed to fetch hypothesis review', { uri, error });
        return 'unavailable' as const; // TODO: could be not-found
      },
    ),
    TE.chainEitherK(flow(
      hypothesisAnnotation.decode,
      E.mapLeft((error) => {
        logger('error', 'Invalid response from hypothes.is', { uri, errors: PR.failure(error) });
        return 'unavailable' as const;
      }),
    )),
    TE.map(toReview(logger)),
  );
};
