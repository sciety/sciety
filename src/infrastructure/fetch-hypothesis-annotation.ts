import { URL } from 'url';
import axios from 'axios';
import * as E from 'fp-ts/Either';
import { Json } from 'fp-ts/Json';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { hypothesisAnnotation, HypothesisAnnotation } from './codecs/HypothesisAnnotation';
import { EvaluationFetcher } from './fetch-review';
import { Logger } from './logger';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Evaluation } from '../types/evaluation';

type GetJson = (uri: string) => Promise<Json>;

const converter = new Remarkable({ html: true }).use(linkify);

const logAndTransformToDataError = (logger: Logger, url: string) => (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 404) {
    logger('warn', 'Missing hypothesis annotation', { error });
    return DE.notFound;
  }
  if (axios.isAxiosError(error)) {
    logger('error', 'Failed to fetch hypothesis evaluation', { error });
  } else {
    logger('error', 'Failed to fetch hypothesis evaluation', { url, error });
  }
  return DE.unavailable;
};

const insertSelectedText = (response: HypothesisAnnotation) => response.text;

const toReview = (logger: Logger) => (response: HypothesisAnnotation) => {
  const evaluation: Evaluation = {
    fullText: pipe(
      process.env.EXPERIMENT_ENABLED === 'true' ? insertSelectedText(response) : response.text,
      (text) => converter.render(text),
      toHtmlFragment,
    ),
    url: new URL(response.links.incontext),
  };
  logger('debug', 'Retrieved evaluation', { ...evaluation, fullText: '[text]' });
  return evaluation;
};

export const fetchHypothesisAnnotation = (getJson: GetJson, logger: Logger): EvaluationFetcher => (key) => {
  const url = `https://api.hypothes.is/api/annotations/${key}`;
  logger('debug', 'Fetching evaluation from Hypothesis', { url });
  return pipe(
    TE.tryCatch(
      async () => getJson(url),
      logAndTransformToDataError(logger, url),
    ),
    TE.chainEitherKW(flow(
      hypothesisAnnotation.decode,
      E.mapLeft((error) => {
        logger('error', 'Invalid response from hypothes.is', { url, errors: PR.failure(error) });
        return DE.unavailable;
      }),
    )),
    TE.map(toReview(logger)),
  );
};
