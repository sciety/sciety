import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { hypothesisAnnotation, HypothesisAnnotation } from './codecs/HypothesisAnnotation';
import { Logger } from './logger';
import { Review } from './review';
import { toHtmlFragment } from '../types/html-fragment';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';

type GetJson = (uri: string) => Promise<Json>;

export type FetchHypothesisAnnotation = (id: HypothesisAnnotationId) => TE.TaskEither<'unavailable', Review>;

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

export const fetchHypothesisAnnotation = (getJson: GetJson, logger: Logger): FetchHypothesisAnnotation => (id) => {
  const uri = `https://api.hypothes.is/api/annotations/${id.value}`;

  logger('debug', 'Fetching review from Hypothesis', { uri });
  return pipe(
    TE.tryCatch(
      async () => getJson(uri),
      (error) => {
        logger('error', 'Failed to fetch hypothesis review', { uri, error });
        return 'unavailable' as const;
      },
    ),
    T.map(E.chain(flow(
      hypothesisAnnotation.decode,
      E.mapLeft(constant('unavailable' as const)), // TODO: log errors
    ))),
    TE.map(toReview(logger)),
  );
};
